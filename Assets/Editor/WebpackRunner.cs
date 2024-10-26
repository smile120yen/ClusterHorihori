using UnityEditor;
using UnityEngine;
using System.Diagnostics;
using System.IO;

public class WebpackRunner : EditorWindow
{
    [MenuItem("Tools/Run Webpack")]
    public static void RunWebpack()
    {
        // ClusterScriptフォルダに移動してコマンドを実行
        string clusterScriptPath = Path.Combine(Application.dataPath, "ClusterScript");
        RunCommand("npx webpack --mode development", clusterScriptPath);
    }

    [MenuItem("Tools/Run Webpack Production")]
    public static void RunWebpackProduction()
    {
        // ClusterScriptフォルダに移動してコマンドを実行
        string clusterScriptPath = Path.Combine(Application.dataPath, "ClusterScript");
        RunCommand("npx webpack --mode production", clusterScriptPath);
    }


    private static void RunCommand(string command, string workingDirectory)
    {
        Process process = new Process();
        process.StartInfo.FileName = "cmd.exe";
        process.StartInfo.Arguments = "/c " + command;
        process.StartInfo.WorkingDirectory = workingDirectory;  // ClusterScriptフォルダに設定
        process.StartInfo.RedirectStandardOutput = true;
        process.StartInfo.RedirectStandardError = true;
        process.StartInfo.UseShellExecute = false;
        process.StartInfo.CreateNoWindow = true;

        // プロセスを開始
        process.Start();

        // 標準出力を表示
        string output = process.StandardOutput.ReadToEnd();
        if (!string.IsNullOrEmpty(output))
        {
            UnityEngine.Debug.Log(output);
        }

        // エラー出力がある場合のみ表示
        string error = process.StandardError.ReadToEnd();
        if (!string.IsNullOrEmpty(error))
        {
            UnityEngine.Debug.LogError(error);
        }

        // プロセスが終了するまで待機
        process.WaitForExit();
    }
}