Shader "Custom/LockonMarkerShaderWithFillAmount"
{
    Properties
    {
        _MainTex ("Texture", 2D) = "white" {}
        _MainColor ("Main Color", Color) = (0,0,0,0)
        _ImageScale ("Image Scale", float) = 1.0
        _FillAmount ("Fill Amount", Range(0, 1)) = 1.0
        _MaskColor ("Mask Color", Color) = (0,0,0,0)
    }
    SubShader
    {
        Tags { "RenderType"="Transparent" }
        LOD 100
        // ���߃I�u�W�F�N�g�̕`�揇�����w��
        Tags { "Queue" = "Overlay" }

        Pass
        {
            // �A���t�@�u�����f�B���O�̗L����
            Blend SrcAlpha OneMinusSrcAlpha
            // �[�x�������݂̖�����
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
            };

            sampler2D _MainTex;
            float4 _MainTex_ST;
            float4 _MainColor;
            float _ImageScale; // �摜�̃T�C�Y�����p�̃v���p�e�B
            float _FillAmount;
            float4 _MaskColor;

            v2f vert (appdata v)
            {
                v2f o;
                float4 scaledVertex = v.vertex;

                float3 worldPos = mul(unity_ObjectToWorld, v.vertex);
                float cameraToObjLength = length(_WorldSpaceCameraPos - worldPos);

                scaledVertex.xy *= _ImageScale * cameraToObjLength;
                
                o.vertex = mul(UNITY_MATRIX_P, mul(UNITY_MATRIX_MV, float4(0, 0, 0, 1)) + float4(scaledVertex.x, scaledVertex.y, 0, 0));
                o.uv = TRANSFORM_TEX(v.uv, _MainTex);
                UNITY_TRANSFER_FOG(o,o.vertex);
                return o;
            }

            fixed4 frag (v2f i) : SV_Target
            {
                float2 center = float2(0.5, 0.5); // �}�X�N�̒��S��UV��Ԃ̒����ɐݒ�
                float2 dir = i.uv - center;
                float angle = atan2(dir.y, dir.x) * (180.0 / UNITY_PI) + 180.0; // �p�x��0~360�ɐ��K��

                angle = fmod(angle + 270.0, 360.0);

                 float currentFillAngle = _FillAmount * 360.0;
                if (angle > currentFillAngle)
                {
                    float4 col = _MaskColor;
                    col.a *= tex2D(_MainTex, i.uv).a;
                    return col; // �}�X�N�O�̐F
                }

                // �e�N�X�`���̃T���v��
                fixed4 col = tex2D(_MainTex, i.uv) * _MainColor;
                // �t�H�O�̓K�p
                UNITY_APPLY_FOG(i.fogCoord, col);
                return col;
            }
            ENDCG
        }
    }
    // �V�F�[�_�[�̃����_�����O���[�h��ݒ肷�邽�߂̃t�H�[���o�b�N�i�������[�h��L���ɂ���j
    Fallback "Transparent/VertexLit"
}