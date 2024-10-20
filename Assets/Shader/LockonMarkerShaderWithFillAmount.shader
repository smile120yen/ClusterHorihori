Shader "Custom/LockonMarkerShaderWithFillAmount"
{
    Properties
    {
        _MainTex ("Texture", 2D) = "white" {}
        _MainColor ("Main Color", Color) = (0,0,0,0)
        _ImageScale ("Image Scale", float) = 1.0
        _FillAmount ("Fill Amount", Range(0, 1)) = 1.0
        _MaskColor ("Mask Color", Color) = (0,0,0,0)
        _FadeStartDistance ("Fade Start Distance", float) = 10.0 // フェード開始距離
        _FadeEndDistance ("Fade End Distance", float) = 50.0 // フェード終了距離
    }
    SubShader
    {
        Tags { "RenderType"="Transparent" }
        LOD 100
        // 透過オブジェクトの描画順序を指定
        Tags { "Queue" = "Overlay" }

        Pass
        {
            // アルファブレンディングの有効化
            Blend SrcAlpha OneMinusSrcAlpha
            // 深度書き込みの無効化
            ZWrite Off
            ZTest Always
            Offset -1, -1

            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            // make fog work
            #pragma multi_compile_fog

            #include "UnityCG.cginc"

            struct appdata
            {
                float4 vertex : POSITION;
                float2 uv : TEXCOORD0;
            };

            struct v2f
            {
                float2 uv : TEXCOORD0;
                UNITY_FOG_COORDS(1)
                float4 vertex : SV_POSITION;
                float distance : TEXCOORD1; // カメラとの距離を渡す
            };

            sampler2D _MainTex;
            float4 _MainTex_ST;
            float4 _MainColor;
            float _ImageScale; // 画像のサイズ調整用のプロパティ
            float _FillAmount;
            float4 _MaskColor;
            float _FadeStartDistance;
            float _FadeEndDistance;

            v2f vert (appdata v)
            {
                v2f o;
                float4 scaledVertex = v.vertex;

                float3 worldPos = mul(unity_ObjectToWorld, v.vertex);
                float cameraToObjLength = length(_WorldSpaceCameraPos - worldPos);

                scaledVertex.xy *= _ImageScale * cameraToObjLength;
                
                o.vertex = mul(UNITY_MATRIX_P, mul(UNITY_MATRIX_MV, float4(0, 0, 0, 1)) + float4(scaledVertex.x, scaledVertex.y, 0, 0));
                o.uv = TRANSFORM_TEX(v.uv, _MainTex);
                o.distance = cameraToObjLength;
                UNITY_TRANSFER_FOG(o,o.vertex);
                return o;
            }

            fixed4 frag (v2f i) : SV_Target
            {
                // フェード係数を計算（0 = 完全に見えない, 1 = 完全に表示）
                float fadeFactor = saturate((_FadeEndDistance - i.distance) / (_FadeEndDistance - _FadeStartDistance));

                float2 center = float2(0.5, 0.5); // マスクの中心をUV空間の中央に設定
                float2 dir = i.uv - center;
                float angle = atan2(dir.y, dir.x) * (180.0 / UNITY_PI) + 180.0; // 角度を0~360に正規化

                angle = fmod(angle + 270.0, 360.0);

                 float currentFillAngle = _FillAmount * 360.0;
                if (angle > currentFillAngle)
                {
                    float4 col = _MaskColor;
                    // 距離に応じてアルファを調整
                    col.a *= tex2D(_MainTex, i.uv).a * fadeFactor;
                    return col; // マスク外の色
                }

                // テクスチャのサンプル
                fixed4 col = tex2D(_MainTex, i.uv) * _MainColor;
                col.a *= fadeFactor; // 距離に応じてアルファを調整

                // フォグの適用
                UNITY_APPLY_FOG(i.fogCoord, col);
                return col;
            }
            ENDCG
        }
    }
    // シェーダーのレンダリングモードを設定するためのフォールバック（透明モードを有効にする）
    Fallback "Transparent/VertexLit"
}