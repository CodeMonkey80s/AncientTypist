<?php
/* Smarty version 3.1.33, created on 2019-10-05 03:16:22
  from '/home/mp/www/myprojects/AncientTypist/templates/index.tpl' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.33',
  'unifunc' => 'content_5d97eee62da674_44066219',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    'e73942abd61abfec214003df1e42a7be98965ab1' => 
    array (
      0 => '/home/mp/www/myprojects/AncientTypist/templates/index.tpl',
      1 => 1570238180,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5d97eee62da674_44066219 (Smarty_Internal_Template $_smarty_tpl) {
?><!doctype html>
<html lang='en'>
<head>
  <meta charset='utf-8'>
  <title><?php echo $_smarty_tpl->tpl_vars['appName']->value;?>
</title>
  <meta name='description' content='Learn Touch Typing with Ancient Texts from Beyond!'>
  <meta name='author' content='Michal Przybylowicz (c) 2019'>
  <link rel='icon' href='gfx/favicon.png'>
  <link href='https://fonts.googleapis.com/css?family=Fira+Code|Bad+Script|Roboto' rel='stylesheet'>
  <link rel='stylesheet' href='css/normalize.css'>
  <link rel='stylesheet' href='css/font-awesome-all.min.css'>
  <link rel='stylesheet' href='css/main.css'>
  <link rel='stylesheet' href='css/Chart.min.css'>
  <?php echo '<script'; ?>
 src='js/jquery.min.js'><?php echo '</script'; ?>
>
  <?php echo '<script'; ?>
 src='js/Chart.min.js'><?php echo '</script'; ?>
>
</head>
<body>
<div id='headWrap'>
  <div id='headArea'>
    <table>
      <tr>
        <td class='column1'>
          <span class="displayNone" id="bookId"><?php echo $_smarty_tpl->tpl_vars['player']->value['bookId'];?>
</span>
          <h1><?php echo $_smarty_tpl->tpl_vars['player']->value['bookTitle'];?>
</h1>
          <h2>By <?php echo $_smarty_tpl->tpl_vars['player']->value['bookAuthor'];?>
</h2>
        </td>
        <td class='column2'>
            <?php if ($_smarty_tpl->tpl_vars['player']->value['bookCurrentPage'] == 1) {?>
              <a href='javascript:void(0)' id='goToPagePrevious' class="disabled"><i class='fas fa-chevron-left'></i></a>
            <?php } else { ?>
              <a href='?book=<?php echo $_smarty_tpl->tpl_vars['player']->value['bookId'];?>
&page=<?php echo $_smarty_tpl->tpl_vars['player']->value['bookPreviousPage'];?>
' id='goToPagePrevious'><i class='fas fa-chevron-left'></i></a>
            <?php }?>
          <span class='bookInfoPages'><span id='page' class='page'><?php echo $_smarty_tpl->tpl_vars['player']->value['bookCurrentPage'];?>
</span>/<span id='totalPages' class='totalPages'><?php echo $_smarty_tpl->tpl_vars['player']->value['bookTotalPages'];?>
</span></span>
            <?php if ($_smarty_tpl->tpl_vars['player']->value['bookCurrentPage'] == $_smarty_tpl->tpl_vars['player']->value['bookTotalPages']) {?>
              <a href='javascript:void(0)' id='goToPageNext' class="disabled"><i class='fas fa-chevron-right'></i></a>
            <?php } else { ?>
              <a href='?book=<?php echo $_smarty_tpl->tpl_vars['player']->value['bookId'];?>
&page=<?php echo $_smarty_tpl->tpl_vars['player']->value['bookNextPage'];?>
' id='goToPageNext'><i class='fas fa-chevron-right'></i></a>
            <?php }?>
        </td>
        <td class='column3'>
          <span class="pointsWrap" title="Total amount of time spent on typing lessons"><i class="far fa-clock"></i><span id='playerTotalTime'>0</span></span>
          <span class="pointsWrap" title="Total amount of pages completed"><i class="far fa-file-alt"></i><span id='playerTotalFinishedPages'>0</span></span>
          <span class='gemsWrap' title="Gems awarded"><i class="far fa-gem"></i><span id='playerRewardGems' class='gems'>0/<?php echo $_smarty_tpl->tpl_vars['player']->value['bookTotalPages'];?>
</span></span>
          <span class='rulerWrap'><span class="ruler">&nbsp;</span></span>
          <a href='javascript:void(0)' id='iconOptions'><i class='fas fa-cog'></i></a>
        </td>
      </tr>
    </table>
  </div>
</div>
<div id="headOptionsWrap" class="displayNone">
  <div id="headOptionsArea">
    <table id="tableOptions">
      <tr>
        <td class="column1">
          <span>Sounds <i class='fas fa-volume-up'></i> : </span>
        </td>
        <td class="column2" id="optionSounds">
          <a href="javascript:void(0)" data-value="On">Enabled</a> / <a href="javascript:void(0)" data-value="Off">Disabled</a>
        </td>
      </tr>
      <tr>
        <td class="column1">
          <span>Word Speed <i class='fas fa-tachometer-alt'></i> : </span>
        </td>
        <td class="column2" id="optionWordSpeed">
          <a href="javascript:void(0)" data-value="On">Enabled</a> / <a href="javascript:void(0)" data-value="Off">Disabled</a>
        </td>
      </tr>
      <tr>
        <td class="column1">
          <span>Unit <i class="fas fa-info-circle"></i> : </span>
        </td>
        <td class="column2" id="optionSpeedUnit">
          <a href="javascript:void(0)" data-value="cpm">CPM</a> / <a href="javascript:void(0)" data-value="wpm">WPM</a>
        </td>
      </tr>
      <tr>
        <td class="column1">
          <span>Progress Graph <i class='fas fa-chart-line'></i> : </span>
        </td>
        <td class="column2" id="optionProgressBar">
          <a href="javascript:void(0)" data-value="On">Enabled</a> / <a href="javascript:void(0)" data-value="Off">Disabled</a>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <hr>
        </td>
      </tr>
      <tr>
        <td class="column1">
          <span>Statistics <i class='fas fa-trash-alt'></i> : </span>
        </td>
        <td class="column2" id="optionResetStatistics">
          <a href="javascript:void(0)" data-value="On">Reset Progress</a>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <hr>
        </td>
      </tr>
    </table>
    <table id="tableBooks">
      <tr>
        <td class="book" data-book-id="3">
          <h2>Dagon</h2>
          <p>&quot;I am writing this under an appreciable mental strain, since by tonight I shall be no more. Penniless, and at the end of my supply of the drug which alone makes life endurable ...&quot;</p>
          <p class="pages"><span class="percent">0%</span><b> of <span class="pagesNum">90 pages</span></b></p>
        </td>
        <td class="book" data-book-id="2">
          <h2>The Hound</h2>
          <p>&quot;In my tortured ears there sounds unceasingly a nightmare whirring and flapping, and a faint, distant baying as of some gigantic hound. It is not dream ...&quot;</p>
          <p class="pages"><span class="percent">0%</span> of <b><span class="pagesNum">125</span> pages</b></p>
        </td>
        <td class="book" data-book-id="5">
          <h2>The Silver Key</h2>
          <p>&quot;When Randolph Carter was thirty he lost the key of the gate of dreams. Prior to that time he had made up for the prosiness of life by nightly excursions to strange and ancient cities ...&quot;</p>
          <p class="pages"><span class="percent">0%</span> of <b><span class="pagesNum">200</span> pages</b></p>
        </td>
      </tr>
      <tr>
        <td class="book" data-book-id="4">
          <h2>Pickman's Model</h2>
          <p>&quot;You needn't think I'm crazy, Eliot-plenty of others have queerer prejudices than this. Why don't you laugh at Oliver's grandfather, who won't ride in a motor?&quot;</p>
          <p class="pages"><span class="percent">0%</span> of <b><span class="pagesNum">217</span> pages</b></p>
        </td>
        <td class="book" data-book-id="1">
          <h2>Colour Out of Space</h2>
          <p>&quot;West of Arkham the hills rise wild, and there are valleys with deep woods that no axe has ever cut. There are dark narrow glens where the trees  slope fantastically ...&quot;</p>
          <p class="pages"><span class="percent">0%</span> of <b><span class="pagesNum">409</span> pages</b></p>
        </td>
        <td class="book" data-book-id="6">
          <h2>The Dreams in the Witch House</h2>
          <p>&quot;Whether the dreams brought on the fever or the fever brought on the dreams Walter Gilman did not know.&quot;</p>
          <p class="pages"><span class="percent">0%</span> of <b><span class="pagesNum">626</span> pages</b></p>
        </td>
      </tr>
    </table>
  </div>
</div>
<div id='bodyWrap' tabindex="0">
  <div id='bodyArea'>
    <div id='textWrap'>
      <div id='textArea'><?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['player']->value['lessonText'], 'character', false, 'k');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['k']->value => $_smarty_tpl->tpl_vars['character']->value) {
if ($_smarty_tpl->tpl_vars['character']->value == ' ') {?><span class='char space'>&#x2423;</span><wbr><?php } else { ?><span class='char'><?php echo $_smarty_tpl->tpl_vars['character']->value;?>
</span><?php }
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?></div>
    </div>
  </div>
</div>
<div id="statusWrap">
  <div id="statusArea">
    <p id="messageClickTextToStart">Click text to start...</p>
    <p id="messageJustStartTyping" class="displayNone">Just start typing...</p>
    <table id="tableWithStatistics" class="displayNone">
      <tr>
        <td>Time: <span id="statisticTime">-</span></td>
        <td>Speed: <span id="statisticSpeed">-</span></td>
        <td>Accuracy: <span id="statisticAccuracy">-</span></td>
        <td>Errors: <span id="statisticErrors">-</span></td>
        <td>Reward: <span id="statisticGems">-</span></td>
      </tr>
    </table>
  </div>
</div>
<div id="progressWrap">
  <div id="progressArea">
    <div id="canvasWrap">
      <canvas id="progressChart" width="1" height="1"></canvas>
    </div>
    <table id="tableWithAverages">
      <tr>
        <td>Average Speed: <span id="averageSpeed">-</span></td>
        <td>Average Accuracy: <span id="averageAccuracy">-</span></td>
        <td>Average Errors: <span id="averageErrors">-</span></td>
      </tr>
    </table>
  </div>
  
</div>
<div id="footWrap">
  <div id="footArea">
    <table>
      <tr>
        <td class="column1">&ldquo;The most merciful thing in the world... is the inability of the human mind to correlate all its contents.&rdquo;</td>
        <td class="column2">Copyright &copy; 2019 by <b><span id="appName"><?php echo $_smarty_tpl->tpl_vars['appName']->value;?>
</span></b>
          <span id="appVersion"><?php echo $_smarty_tpl->tpl_vars['appVersion']->value;?>
</span><img src="gfx/icon-elder-sign.png" alt="Elder Sign"></td>
      </tr>
    </table>
  </div>
</div>
<?php echo '<script'; ?>
 src='js/main.js'><?php echo '</script'; ?>
>
</body>
</html>
<?php }
}
