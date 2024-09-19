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

    [ContextMenu("スクショ")]
    public void ScreenShot()
    {
        var savePath = Application.dataPath + "/icons/"+ fileName + ".png";
        var renderTexture = new RenderTexture(size.x, size.y, 0);
        camera.targetTexture = renderTexture;

        camera.clearFlags = CameraClearFlags.SolidColor;
        camera.backgroundColor = new Color(0, 0, 0, 0);

        // カメラの描画をテクスチャーに書き込み
        camera.Render();
        // 現在のアクティブなRenderTextuerをキャッシュ
        var cache = RenderTexture.active;
        // Pixel情報を読み込むためにアクティブに指定
        RenderTexture.active = renderTexture;
        var texture = new Texture2D(size.x, size.y, TextureFormat.RGBA32, false);
        // RenderTexture.activeから読み込み
        texture.ReadPixels(new Rect(0, 0, size.x, size.y), 0, 0);
        // テクスチャの保存
        texture.Apply();

        try
        {
            File.WriteAllBytes(savePath, texture.EncodeToPNG());
            Debug.Log("保存しました");

#if UNITY_EDITOR
            // アセットをリフレッシュしてProjectビューを更新
            AssetDatabase.Refresh();
#endif
        }
        catch
        {
            Debug.LogError("エラー");
        }

        RenderTexture.active = cache;
        camera.targetTexture = null;
        DestroyImmediate(renderTexture);
    }
}