<?php

/**
 * Process Book
 *
 * This script will process the input text file and output text as parapgrphs
 */

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

ini_set('xdebug.var_display_max_depth', '10');
ini_set('xdebug.var_display_max_children', '512');
ini_set('xdebug.var_display_max_data', '2024');

/**
 * Processes text file and outputs paragraphs
 * 
 * @param $text
 * @param int $maxLength
 * @param int $maxLines
 * @return array
 */
function breakIntoParagraphs($text, $maxLength = 38, $maxLines = 4)
{
    $words = explode(" ", $text);
    $totalNumberOfWords = count($words);
    //echo "Words: {$totalNumberOfWords}\n";

    $paragraphTexts = [];

    $paragraphNum = 0;
    $paragraphLines = [];
    
    $lineLenght = 0;
    $lineText = "";
    $lineNum = 0;

    $wordNum  = 0;
    foreach ($words as $word) {
        $wordLength = strlen($word) + 1;
        if ($lineLenght + $wordLength > $maxLength) {
            if ($lineNum < $maxLines - 1) {
                $paragraphLines[$lineNum] = $lineText;
            } else {
                $paragraphLines[$lineNum] = rtrim($lineText);
            }
            $lineText = $word . " ";
            $lineLenght = strlen($lineText);
            $lineNum += 1;
        } else if ($lineLenght + $wordLength <= $maxLength) {
            $lineLenght += $wordLength;
            $lineText .= $word . " ";
        }
        if ($lineNum >= $maxLines) {
            $paragraphNum += 1;
            $lineNum = 0;
            $paragraphTexts[$paragraphNum] = $paragraphLines;
            $paragraphLines = [];
        }
        if ($wordNum==$totalNumberOfWords-1) {
            $paragraphNum += 1;
            if (count($paragraphLines)==0) {
                $lineNum = 0;
                $paragraphLines[0] = $lineText; 
            } else {
                $lineNum += 1;
            }
            if (isset($paragraphLines[$lineNum])) {
                $paragraphLines[$lineNum] = rtrim($paragraphLines[$lineNum]);
            }
            $paragraphTexts[$paragraphNum] = $paragraphLines;
        }
        $wordNum += 1;
    }

    return $paragraphTexts;
}

/**
 * Main logic of the script
 */
function run()
{

    global $argv;

    // Do we have a path to a file?
    if (empty($argv[1])) {
        echo "ERROR: Please provide a path to the text file!\n";
    }

    $filename = $argv[1];
    if (!is_file($filename)) {
        echo "ERROR: Not a file!\n";
    }

    $contents = file_get_contents($filename);

    $paragraphs = breakIntoParagraphs($contents, 38, 4);
    if (count($paragraphs) > 0) {
        echo "Unnamed\n";
        echo "Unknown\n";
        //var_dump(array_slice($paragraphs, 0, 3));
        //var_dump($paragraphs);
        //var_dump(array_slice($paragraphs, -2));
        foreach ($paragraphs as $paragraph) {
            foreach ($paragraph as $line) {

                $line = str_replace("—", "-", $line);
                $line = str_replace("’", "'", $line);
                $line = str_replace('“', '"', $line);
                $line = str_replace('”', '"', $line);
                
                echo "{$line}";
            }
            echo "\n";
        }
    }
}

// *** Run the script
run();

?>
