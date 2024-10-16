#if UNITY_EDITOR
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEditor;
using UnityEditor.Experimental.SceneManagement;
using UnityEditor.SceneManagement;

public class AutoSetupIcons : MonoBehaviour
{
    [SerializeField] List<Sprite> sprites = new List<Sprite>();
    [SerializeField] GameObject iconPrefab;

    [ContextMenu("setup")]
    public void Setup()
    {
        PrefabStage prefabStage = PrefabStageUtility.GetCurrentPrefabStage();
        List<GameObject> children = new List<GameObject>();
        foreach (Transform child in transform)
        {
            children.Add(child.gameObject);
        }

        foreach (GameObject child in children)
        {
            DestroyImmediate(child);
        }

        foreach(Sprite sprite in sprites)
        {
            GameObject temp = Instantiate(iconPrefab, transform);
            temp.GetComponent<Image>().sprite = sprite;
            temp.name = sprite.name;
        }
        PrefabUtility.SaveAsPrefabAsset(prefabStage.prefabContentsRoot, prefabStage.assetPath);

    }

    [ContextMenu("consoleOutputText")]
    public void ConsoleOutputText()
    {
        string temp = "";

        foreach (Sprite sprite in sprites)
        {
            temp += "\""+sprite.name + "\",";
        }

        Debug.Log(temp);
    }
}
#endif