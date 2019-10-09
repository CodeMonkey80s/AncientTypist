<?php

// *** PHP Configuration
// ----------------------------------------------------------------------------

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

ini_set('xdebug.var_display_max_depth', '10');
ini_set('xdebug.var_display_max_children', '256');
ini_set('xdebug.var_display_max_data', '1024');

// *** Autoloads // Requires // Includes
// ----------------------------------------------------------------------------

require('vendor' . DIRECTORY_SEPARATOR . 'autoload.php');

// *** Application
// ----------------------------------------------------------------------------

/**
 * Main Application Class
 *
 * Class Application
 */
class Application
{
    private $booksDir = "resources";
    private $viewDir = "templates";
    private $view = null;

    /**
     * Application constructor
     *
     * Set application specific defaults
     */
    public function __construct()
    {
        $this->view = new Smarty();

        $this->view->assign('appName', "Ancient Typist");
        $this->view->assign('appVersion', "v1.20");
    }

    /**
     * Application logic
     *
     * @throws SmartyException
     */
    public function run()
    {
        // *** Set Defaults
        $player = [
            // Book
            'bookTitle'          => '?',
            'bookAuthor'         => '?',
            'bookCurrentPage'    => 0,
            'bookPreviousPage'   => 0,
            'bookNextPage'       => 0,
            'bookFinishedPages'  => 0,
            'bookTotalPages'     => 0,
            'bookId'             => 0,
            // Player
            'rewardPoints'       => 0,
            'rewardStars'        => 0,
            'totalFinishedPages' => 0,
            // Lesson
            'lessonText'         => 'Ancient Text To Type.',
        ];

        // Load selected book...
        $bookId = (isset($_GET["book"]) ? intval($_GET["book"]) : 1);
        if ($bookId > 6) $bookId = 6;
        if ($bookId < 0) $bookId = 1;

        // *** Load selected book's content
        $bookLines = file(getcwd() . "/{$this->booksDir}/book{$bookId}.txt");
        $bookTotalPages = count($bookLines) - 2;

        // *** Load selected text...
        $page = (isset($_GET["page"]) ? intval($_GET["page"]) : 1);
        if ($page > $bookTotalPages) {
            $page = $bookTotalPages;
        }
        if ($page < 0) $page = 1;
        
        $bookPreviousPage = $page - 1;
        if ($bookPreviousPage < 1) {
            $bookPreviousPage = 1;
        }
        $bookNextPage = $page + 1;
        if ($bookNextPage >= $bookTotalPages) {
            $bookNextPage = $bookTotalPages;
        }
        
        // *** Prepare text...
        $index = $page + 1;
        $lessonText = $bookLines[$index];
        $lessonText = trim(str_replace(["\r", "\n", "\r\n"], "", $lessonText));
        $lessonText = str_split($lessonText);

        // *** Fill player data...
        $player['bookId'] = $bookId;
        $player['bookTitle'] = $bookLines[0] ?: "Unknown";
        $player['bookAuthor'] = $bookLines[1] ?: "Unnamed";
        $player['bookCurrentPage'] = $page;
        $player['bookPreviousPage'] = $bookPreviousPage;
        $player['bookNextPage'] = $bookNextPage;
        $player['bookTotalPages'] = $bookTotalPages;
        $player['lessonText'] = $lessonText;

        // *** Display the page...
        $this->view->assign('player', $player);
        $this->view->display("{$this->viewDir}/index.tpl");
    }
}

// *** Run
// ----------------------------------------------------------------------------

$application = new Application();
$application->run();
