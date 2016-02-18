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
            currentlyPlayingSongNumber = songNumber;
            currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
            updatePlayerBarSong();
        } else if (currentlyPlayingSongNumber === songNumber) {
            $songItem.html(playButtonTemplate);
            $('.main-controls a.play-pause').html(playerBarPlayButton);
            currentlyPlayingSongNumber = null;
            currentSongFromAlbum = null;
        } else if (currentlyPlayingSongNumber !== songNumber) {
            $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]').html(currentlyPlayingSongNumber);
            $songItem.html(pauseButtonTemplate);
            currentlyPlayingSongNumber = songNumber;
            currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
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
    var nextSong = currentAlbum.songs[nextSongIndex];
    var $songItems = $('.album-view td.song-item-number');
    // set current song to song number
    $songItems.eq(currentlyPlayingSongNumber -1).html(currentlyPlayingSongNumber);
    // reassign variables to next song
    currentSongFromAlbum = nextSong;
    currentlyPlayingSongNumber = nextSongIndex + 1;
    // change next song to playing
    $songItems.eq(nextSongIndex).html(pauseButtonTemplate);
    // updated player bar for next song
    updatePlayerBarSong();
    
};

var previousSong = function() {
    var prevSongIndex =  (currentAlbumLength + trackIndex(currentAlbum, currentSongFromAlbum) - 1) % currentAlbumLength;
    var prevSong = currentAlbum.songs[prevSongIndex];
    var $songItems = $('.album-view td.song-item-number');
    // set current song to its song number
    $songItems.eq(currentlyPlayingSongNumber -1).html(currentlyPlayingSongNumber);
    // reassign variables to previous song
    currentSongFromAlbum = prevSong;
    currentlyPlayingSongNumber = prevSongIndex + 1;
    // change previous song to playing
    $songItems.eq(prevSongIndex).html(pauseButtonTemplate);
    // updated player bar for previous song
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

var $previousButton = $('.main-controls a.previous');
var $nextButton = $('.main-controls a.next');


$(document).ready(function () {

    setCurrentAlbum(albumPicasso);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
});