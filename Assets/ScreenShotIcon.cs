using System.IO;
using UnityEngine;

#if UNITY_EDITOR
using UnityEditor;
#endif

[ExecuteAlways]
public class ScreenShotIcon : MonoBehaviour
{
    [SerializeField] Camera camera;
    [SerializeField] Vector2Int size;
    [SerializeField] string fileName;

    [ContextMenu("�X�N�V��")]
    public void ScreenShot()
    {
        var savePath = Application.dataPath + "/icons/"+ fileName + ".png";
        var renderTexture = new RenderTexture(size.x, size.y, 0);
        camera.targetTexture = renderTexture;

        camera.clearFlags = CameraClearFlags.SolidColor;
        camera.backgroundColor = new Color(0, 0, 0, 0);

        // �J�����̕`����e�N�X�`���[�ɏ�������
        camera.Render();
        // ���݂̃A�N�e�B�u��RenderTextuer���L���b�V��
        var cache = RenderTexture.active;
        // Pixel����ǂݍ��ނ��߂ɃA�N�e�B�u�Ɏw��
        RenderTexture.active = renderTexture;
        var texture = new Texture2D(size.x, size.y, TextureFormat.RGBA32, false);
        // RenderTexture.active����ǂݍ���
        texture.ReadPixels(new Rect(0, 0, size.x, size.y), 0, 0);
        // �e�N�X�`���̕ۑ�
        texture.Apply();

        try
        {
            File.WriteAllBytes(savePath, texture.EncodeToPNG());
            Debug.Log("�ۑ����܂���");

#if UNITY_EDITOR
            // �A�Z�b�g�����t���b�V������Project�r���[���X�V
            AssetDatabase.Refresh();
#endif
        }
        catch
        {
            Debug.LogError("�G���[");
        }

        RenderTexture.active = cache;
        camera.targetTexture = null;
        DestroyImmediate(renderTexture);
    }
}