using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TemporaryCachePath : MonoBehaviour
{
    [ContextMenu("printPath")]
    void PrintPath()
    {
        // print the path to the temporary data folder
        print(Application.temporaryCachePath);
    }
}