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

                // �J�����̃r���[�s����擾
                float4x4 viewMatrix = UNITY_MATRIX_V;
                
                // �r���[�s��̋t�s����v�Z
                float4x4 inverseViewMatrix = mul(unity_CameraInvProjection, UNITY_MATRIX_I_V);
                
                // �J�����̉E�x�N�g���Ə�x�N�g�����擾
                float3 right = inverseViewMatrix[0].xyz;
                float3 up = inverseViewMatrix[1].xyz;

                // ���S�ʒu���擾
                float3 center = mul(unity_ObjectToWorld, v.vertex).xyz;

                // ���_���r���{�[�h�̊p�ɕϊ�
                float halfSize = 0.5; // �e�N�X�`���̃T�C�Y���w��
                center += right * (v.texcoord.x - 0.5) * halfSize;
                center += up * (v.texcoord.y - 0.5) * halfSize;

                // �ϊ���̒��_���N���b�v��Ԃɕϊ�
                o.vertex = mul(UNITY_MATRIX_VP, float4(center, 1.0));
                o.uv = TRANSFORM_TEX(v.texcoord, _MainTex);
                
                return o;
            }

            fixed4 frag (v2f i) : SV_Target
            {
                // �e�N�X�`���̐F���擾
                fixed4 col = tex2D(_MainTex, i.uv);
                return col;
            }
            ENDCG
        }
    }
    FallBack "Diffuse"
}