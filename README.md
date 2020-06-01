# url-tetris

This is a version of the popular Tetris game running in your address bar!

[View Demo](https://url-tetris.tongong.now.sh/)

## Controls

<table style="text-align: center;">
    <tr>
        <td>W or ⬆️</td>
        <td>Move upwards</td>
    </tr>
    <tr>
        <td>A or ⬅️</td>
        <td>Move leftwards</td>
    </tr>
    <tr>
        <td>S or ⬇️</td>
        <td>Move downwards</td>
    </tr>
    <tr>
        <td>D or ➡️</td>
        <td>Rotate</td>
    </tr>
    <tr>
        <td>SPACE</td>
        <td>Start the game</td>
    </tr>
</table>

## How does it work

This project was made in vanilla JavaScript. With the [History.replaceState()](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState) method the current url can be changed without reloading the page. For the graphics [Braille Patterns](https://en.wikipedia.org/wiki/Braille_Patterns) are used.

## Browser support

I tested the game with Firefox and Chrome for both Linux and Android. Desktop Firefox works perfectly. Chrome behaves weirdly: some Unicode characters are percent-encoded in the url, some aren't. On both of the tested Android browsers all Unicode characters are percent-encoded. That's why I didn't add mobile controls.

## Inspired by

-   [URL Hunter](http://probablycorey.com/url-hunter)
-   [Flappy Braille](http://flappybraille.ndre.gr)