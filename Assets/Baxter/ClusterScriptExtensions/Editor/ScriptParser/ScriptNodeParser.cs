using System.Linq;
using Esprima.Ast;
using UnityEngine;

namespace Baxter.ClusterScriptExtensions.Editor.ScriptParser
{
    public static class LiteralParser
    {
        public static bool TryParseBool(Node node, out bool result)
        {
            if (node is Literal literal && literal.BooleanValue is { } value)
            {
                result = value;
                return true;
            }

            result = false;
            return false;
        }

        public static bool TryParseInt(Node node, out int result)
        {
            if (node is Literal literal && literal.NumericValue is { } value)
            {
                result = (int)value;
                return true;
            }

            result = 0;
            return false;
        }

        public static bool TryParseFloat(Node node, out float result)
        {
            if (node is Literal literal && literal.NumericValue is { } value)
            {
                result = (float)value;
                return true;
            }

            result = 0;
            return false;
        }
        
        public static bool TryParseString(Node node, out string result)
        {
            if (node is Literal literal && literal.StringValue is { } value)
            {
                result = value;
                return true;
            }

            result = "";
            return false;
        }

        public static bool TryParseVector2(Node node, out Vector2 result)
        {
            if (node is NewExpression newExpr && newExpr.ChildNodes.Count() == 3)
            {
                var children = newExpr.ChildNodes.ToArray();
                var typeNameNode = children[0];
                var xLiteral = children[1];
                var yLiteral = children[2];
                
                if (typeNameNode is Identifier { Name: "Vector2" } && 
                    xLiteral is Literal { NumericValue: { } xValue } &&
                    yLiteral is Literal { NumericValue: { } yValue })
                {
                    result = new Vector2((float)xValue, (float)yValue);
                    return true;
                }
            }

            result = Vector2.zero;
            return false;
        }
        
        public static bool TryParseVector3(Node node, out Vector3 result)
        {
            if (node is NewExpression newExpr && newExpr.ChildNodes.Count() == 4)
            {
                var children = newExpr.ChildNodes.ToArray();
                var typeNameNode = children[0];
                var xLiteral = children[1];
                var yLiteral = children[2];
                var zLiteral = children[3];
                
                if (typeNameNode is Identifier { Name: "Vector3" } && 
                    xLiteral is Literal { NumericValue: { } xValue } &&
                    yLiteral is Literal { NumericValue: { } yValue } &&
                    zLiteral is Literal { NumericValue: { } zValue })
                {
                    result = new Vector3((float)xValue, (float)yValue, (float)zValue);
                    return true;
                }
            }

            result = Vector3.zero;
            return false;
        }

        //NOTE: これはめったに使えない見込み(x,y,z,wのリテラルでQuaternionを書くことがほぼない)
        public static bool TryParseQuaternion(Node node, out Quaternion result)
        {
            if (node is NewExpression newExpr && newExpr.ChildNodes.Count() == 5)
            {
                var children = newExpr.ChildNodes.ToArray();
                var typeNameNode = children[0];
                var xLiteral = children[1];
                var yLiteral = children[2];
                var zLiteral = children[3];
                var wLiteral = children[4];
                
                if (typeNameNode is Identifier { Name: "Quaternion" } && 
                    xLiteral is Literal { NumericValue: { } xValue } &&
                    yLiteral is Literal { NumericValue: { } yValue } &&
                    zLiteral is Literal { NumericValue: { } zValue } && 
                    wLiteral is Literal { NumericValue: { } wValue })
                {
                    // Cluster Scriptで回転表現以外にQuaternionを使わないはずのため、、normalizeしておく
                    result = new Quaternion((float)xValue, (float)yValue, (float)zValue, (float)wValue).normalized;
                    return true;
                }
            }

            result = Quaternion.identity;
            return false;
        }
    }
}
