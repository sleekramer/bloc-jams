var createSongRow = function (songNumber, songName, songLength) {
    var template =
        '<tr class="album-view-song-item">'
        + '  <td class="song-item-number" data-song-number="'+ songNumber +'">' + songNumber + '</td>'
        + '  <td class="song-item-title">' + songName + '</td>'
        + '  <td class="song-item-duration">' + songLength + '</td>'
        + '</tr>'
    ;
    var $row = $(template);
    
    var clickHandler = function() {
        var $songItem = $(this).find('.song-item-number'),
            songNumber = parseInt($songItem.attr('data-song-number'));
        if (currentlyPlayingSongNumber === null) {
            $songItem.html(pauseButtonTemplate);
            setSong(songNumber);
            updatePlayerBarSong();
        } else if (currentlyPlayingSongNumber === songNumber) {
            $songItem.html(playButtonTemplate);
            $('.main-controls a.play-pause').html(playerBarPlayButton);
            setSong(null);
        } else if (currentlyPlayingSongNumber !== songNumber) {
            getSongNumberCell(currentlyPlayingSongNumber - 1).html(currentlyPlayingSongNumber);
            $songItem.html(pauseButtonTemplate);
            setSong(songNumber);
            updatePlayerBarSong();
        }
        
    };
    
    var onHover = function(event) {
        var $songItem = $(this).find('.song-item-number');
        var songNumber = parseInt($songItem.attr('data-song-number'));
        if (songNumber !== currentlyPlayingSongNumber) {
            $songItem.html(playButtonTemplate);
        }
    };
    
    var offHover = function(event) {
        var $songItem = $(this).find('.song-item-number');
        var songNumber = parseInt($songItem.attr('data-song-number'));
        if (songNumber !== currentlyPlayingSongNumber) {
            $songItem.html(songNumber);
        }
    };
    

    $row.click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
};

var setCurrentAlbum = function (album) {
    currentAlbum = album;
    currentAlbumLength = currentAlbum.songs.length;
    var i;
    var $albumTitle = $('.album-view h2.album-view-title');
    var $albumArtist = $('.album-view h3.album-view-artist');
    var $albumReleaseInfo = $('.album-view h5.album-view-release-info');
    var $albumImage = $('.album-view img.album-cover-art');
    var $albumSongList = $('.album-view table.album-view-song-list');
    
    $albumTitle.text(album.name);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);
    
    $albumSongList.empty();
    
    for (i = 0; i < album.songs.length; i += 1) {
        var $newRow = createSongRow(i + 1, album.songs[i].name, album.songs[i].length);
        $albumSongList.append($newRow);
        
    }
};

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
};

var nextSong = function() {
    var nextSongIndex = (trackIndex(currentAlbum, currentSongFromAlbum) + 1) % currentAlbumLength;

    getSongNumberCell(currentlyPlayingSongNumber - 1).html(currentlyPlayingSongNumber);

    setSong(nextSongIndex + 1);
 
    getSongNumberCell(nextSongIndex).html(pauseButtonTemplate);
  
    updatePlayerBarSong();
    
};

var setSong = function(songNumber) {
    currentlyPlayingSongNumber = songNumber;
    currentSongFromAlbum = songNumber ? currentAlbum.songs[songNumber - 1] : null;
};

var getSongNumberCell = function(number) {
    return $songItemNumbers.eq(number);
};

var previousSong = function() {
    var prevSongIndex =  (currentAlbumLength + trackIndex(currentAlbum, currentSongFromAlbum) - 1) % currentAlbumLength;
    getSongNumberCell(currentlyPlayingSongNumber - 1).html(currentlyPlayingSongNumber);
    setSong(prevSongIndex + 1);
    getSongNumberCell(prevSongIndex).html(pauseButtonTemplate);
    updatePlayerBarSong();
}

var updatePlayerBarSong = function() {
    $('.currently-playing h2.song-name').text(currentSongFromAlbum.name);
    $('.currently-playing h2.artist-song-mobile').text( currentSongFromAlbum.name + " - " + currentAlbum.artist);
    $('.currently-playing h3.artist-name').text(currentAlbum.artist);
    $('.main-controls a.play-pause').html(playerBarPauseButton)
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>'
var playerBarPauseButton = '<span class="ion-pause"></span>'

var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentAlbum = null;
var currentAlbumLength = null;
var $songItemNumbers;

var $previousButton = $('.main-controls a.previous');
var $nextButton = $('.main-controls a.next');

$(document).ready(function () {

    setCurrentAlbum(albumPicasso);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    $songItemNumbers = $('.album-view td.song-item-number');
});