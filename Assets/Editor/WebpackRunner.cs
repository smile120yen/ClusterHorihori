using UnityEditor;
using UnityEngine;
using System.Diagnostics;
using System.IO;

public class WebpackRunner : EditorWindow
{
    [MenuItem("Tools/Run Webpack")]
    public static void RunWebpack()
    {
        // ClusterScript�t�H���_�Ɉړ����ăR�}���h�����s
        string clusterScriptPath = Path.Combine(Application.dataPath, "ClusterScript");
        RunCommand("npx webpack --mode development", clusterScriptPath);
    }

    [MenuItem("Tools/Run Webpack Production")]
    public static void RunWebpackProduction()
    {
        // ClusterScript�t�H���_�Ɉړ����ăR�}���h�����s
        string clusterScriptPath = Path.Combine(Application.dataPath, "ClusterScript");
        RunCommand("npx webpack --mode production", clusterScriptPath);
    }


    private static void RunCommand(string command, string workingDirectory)
    {
        Process process = new Process();
        process.StartInfo.FileName = "cmd.exe";
        process.StartInfo.Arguments = "/c " + command;
        process.StartInfo.WorkingDirectory = workingDirectory;  // ClusterScript�t�H���_�ɐݒ�
        process.StartInfo.RedirectStandardOutput = true;
        process.StartInfo.RedirectStandardError = true;
        process.StartInfo.UseShellExecute = false;
        process.StartInfo.CreateNoWindow = true;

        // �v���Z�X���J�n
        process.Start();

        // �W���o�͂�\��
        string output = process.StandardOutput.ReadToEnd();
        if (!string.IsNullOrEmpty(output))
        {
            UnityEngine.Debug.Log(output);
        }

        // �G���[�o�͂�����ꍇ�̂ݕ\��
        string error = process.StandardError.ReadToEnd();
        if (!string.IsNullOrEmpty(error))
        {
            UnityEngine.Debug.LogError(error);
        }

        // �v���Z�X���I������܂őҋ@
        process.WaitForExit();
    }
}