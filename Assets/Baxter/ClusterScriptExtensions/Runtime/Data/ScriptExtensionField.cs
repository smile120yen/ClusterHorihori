using System;
using Newtonsoft.Json;
using UnityEngine;

namespace Baxter.ClusterScriptExtensions
{   
    /// <summary>
    /// Scriptで定義されたフィールド値1つを表現する値。
    /// 全ての型が入りうるような構造をしており、大きい
    /// </summary>
    [Serializable]
    public class ScriptExtensionField
    {
        // ユーザーは直接編集しない、テンプレートとなるコードから定まる値
        [SerializeField] private string fieldName;
        [SerializeField] private ExtensionFieldType type;
        [SerializeField] private FieldDefinedLocation fieldDefinedLocation;

        // ここもユーザーは直接編集しないテンプレート上の値で、リテラルで書かれた初期値があればそれを保持する
        [SerializeField] private bool boolInitialValue;
        [SerializeField] private int intInitialValue;
        [SerializeField] private float floatInitialValue;
        [SerializeField] private string stringInitialValue;
        [SerializeField] private Vector2 vector2InitialValue;
        [SerializeField] private Vector3 vector3InitialValue;
        [SerializeField] private Quaternion quaternionInitialValue;
        
        // Inspectorで編集するのはここから下の部分
        
        // Scriptに載ってる既定値をオーバーライドするかどうか
        [SerializeField] private bool overrideValue;
        // 下記どれかのうち1つだけが表示される
        [SerializeField] private bool boolValue;
        [SerializeField] private int intValue;
        [SerializeField] private float floatValue;
        [SerializeField] private string stringValue;
        [SerializeField] private Vector2 vector2Value;
        [SerializeField] private Vector3 vector3Value;
        [SerializeField] private Quaternion quaternionValue;
        
        #region Properties

        public string FieldName
        {
            get => fieldName;
            set => fieldName = value;
        }

        public FieldDefinedLocation FieldDefinedLocation
        {
            get => fieldDefinedLocation;
            set => fieldDefinedLocation = value;
        }
        
        public ExtensionFieldType Type
        {
            get => type;
            set => type = value;
        }
        
        public bool BoolInitialValue
        {
            get => boolInitialValue;
            set => boolInitialValue = value;
        }

        public int IntInitialValue
        {
            get => intInitialValue;
            set => intInitialValue = value;
        }

        public float FloatInitialValue
        {
            get => floatInitialValue;
            set => floatInitialValue = value;
        }

        public string StringInitialValue
        {
            get => stringInitialValue;
            set => stringInitialValue = value;
        }

        public Vector2 Vector2InitialValue
        {
            get => vector2InitialValue;
            set => vector2InitialValue = value;
        }

        public Vector3 Vector3InitialValue
        {
            get => vector3InitialValue;
            set => vector3InitialValue = value;
        }

        public Quaternion QuaternionInitialValue
        {
            get => quaternionInitialValue;
            set => quaternionInitialValue = value;
        }

        private bool ActiveBoolValue => overrideValue ? boolValue : boolInitialValue;
        private int ActiveIntValue => overrideValue ? intValue : intInitialValue;
        private float ActiveFloatValue => overrideValue ? floatValue : floatInitialValue;
        private string ActiveStringValue => overrideValue ? stringValue : stringInitialValue;
        private Vector2 ActiveVector2Value => overrideValue ? vector2Value : vector2InitialValue;
        private Vector3 ActiveVector3Value => overrideValue ? vector3Value : vector3InitialValue;
        private Quaternion ActiveQuaternionValue => overrideValue ? quaternionValue : quaternionInitialValue;
        
        #endregion

        public string ToJavaScriptValueLiteral()
        {
            return type switch
            {
                ExtensionFieldType.Bool => ActiveBoolValue ? "true" : "false",
                ExtensionFieldType.Int => $"{ActiveIntValue}",
                ExtensionFieldType.Float => $"{ActiveFloatValue:G}",
                //NOTE: stringのエスケープをJSON扱いすることで捌く。
                // Newtonsoft.Json.JsonConvertを使っているのはCreator Kitに同梱されてて都合が良いため
                ExtensionFieldType.String => JsonConvert.ToString(ActiveStringValue),
                ExtensionFieldType.Vector2 
                    => $"new Vector2({ActiveVector2Value.x:G}, {ActiveVector2Value.y:G})",
                ExtensionFieldType.Vector3 
                    => $"new Vector3({ActiveVector3Value.x:G}, {ActiveVector3Value.y:G}, {ActiveVector3Value.z:G})",
                ExtensionFieldType.Quaternion
                    => $"new Quaternion({ActiveQuaternionValue.x:G}, {ActiveQuaternionValue.y:G}, {ActiveQuaternionValue.z:G}, {ActiveQuaternionValue.w:G})",
                _ => throw new InvalidOperationException("Unsupported type!"),
            };
        }

        public void ResetInitialValues()
        {
            BoolInitialValue = false;
            IntInitialValue = 0;
            FloatInitialValue = 0f;
            StringInitialValue = "";
            Vector2InitialValue = Vector2.zero;
            Vector3InitialValue = Vector3.zero;
            QuaternionInitialValue = Quaternion.identity;
        }

        public void CopyValues(ScriptExtensionField source)
        {
            if (source == null)
            {
                return;
            }

            overrideValue = source.overrideValue;
            boolValue = source.boolValue;
            intValue = source.intValue;
            floatValue = source.floatValue;
            stringValue = source.stringValue;
            vector2Value = source.vector2Value;
            vector3Value = source.vector3Value;
            quaternionValue = source.quaternionValue;
        }
        
        public void ResetValues()
        {
            overrideValue = false;
            boolValue = boolInitialValue;
            intValue = intInitialValue;
            floatValue = floatInitialValue;
            stringValue = stringInitialValue;
            vector2Value = vector2InitialValue;
            vector3Value = vector3InitialValue;
            quaternionValue = quaternionInitialValue;
        }
    }
}
