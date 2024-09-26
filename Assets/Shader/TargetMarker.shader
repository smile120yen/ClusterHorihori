// Upgrade NOTE: replaced '_Object2World' with 'unity_ObjectToWorld'

Shader "Custom/Billboard"
{
    Properties
    {
        _MainTex ("Texture", 2D) = "white" {}
    }
    SubShader
    {
        Tags { "RenderType"="Opaque" }
        LOD 200

        Pass
        {
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #include "UnityCG.cginc"

            sampler2D _MainTex;
            float4 _MainTex_ST;

            struct appdata
            {
                float4 vertex : POSITION;
                float4 texcoord : TEXCOORD0;
            };

            struct v2f
            {
                float2 uv : TEXCOORD0;
                float4 vertex : SV_POSITION;
            };

            v2f vert (appdata v)
            {
                v2f o;

                // カメラのビュー行列を取得
                float4x4 viewMatrix = UNITY_MATRIX_V;
                
                // ビュー行列の逆行列を計算
                float4x4 inverseViewMatrix = mul(unity_CameraInvProjection, UNITY_MATRIX_I_V);
                
                // カメラの右ベクトルと上ベクトルを取得
                float3 right = inverseViewMatrix[0].xyz;
                float3 up = inverseViewMatrix[1].xyz;

                // 中心位置を取得
                float3 center = mul(unity_ObjectToWorld, v.vertex).xyz;

                // 頂点をビルボードの角に変換
                float halfSize = 0.5; // テクスチャのサイズを指定
                center += right * (v.texcoord.x - 0.5) * halfSize;
                center += up * (v.texcoord.y - 0.5) * halfSize;

                // 変換後の頂点をクリップ空間に変換
                o.vertex = mul(UNITY_MATRIX_VP, float4(center, 1.0));
                o.uv = TRANSFORM_TEX(v.texcoord, _MainTex);
                
                return o;
            }

            fixed4 frag (v2f i) : SV_Target
            {
                // テクスチャの色を取得
                fixed4 col = tex2D(_MainTex, i.uv);
                return col;
            }
            ENDCG
        }
    }
    FallBack "Diffuse"
}