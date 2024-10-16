#if UNITY_EDITOR
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using ClusterVR.CreatorKit.Item;
using ClusterVR.CreatorKit.Item.Implements;
using UnityEditor;
using System.Reflection;

public class AutoSetupWorldItemTempleteList : MonoBehaviour
{
    [SerializeField] WorldItemTemplateList worldItemTemplateList;
    [SerializeField] GameObject[] prefabs;

    [ContextMenu("Setup")]
    public void Setup()
    {
        FieldInfo fieldInfo = typeof(WorldItemTemplateList).GetField("worldItemTemplates", BindingFlags.NonPublic | BindingFlags.Instance);

        WorldItemTemplateListEntry[] fieldValue = (WorldItemTemplateListEntry[])fieldInfo.GetValue(worldItemTemplateList);

        WorldItemTemplateListEntry[] newList = new WorldItemTemplateListEntry[prefabs.Length];
        for(int i=0; i<prefabs.Length; i++)
        {
            string id = prefabs[i].name;
            ClusterVR.CreatorKit.Item.Implements.Item item = prefabs[i].GetComponent<ClusterVR.CreatorKit.Item.Implements.Item>();
            ItemTemplateId itemTemplateId = new ItemTemplateId(item.Id.Value);
            newList[i] = new WorldItemTemplateListEntry(id, item, itemTemplateId);
        }

        WorldItemTemplateListEntry[] newValue = newList;

        // 値が変更された場合、フィールドに新しい値をセット
        if (newValue != fieldValue)
        {
            fieldInfo.SetValue(worldItemTemplateList, newValue);
        }
    }
}
#endif