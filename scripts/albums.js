var createSongRow = function (songNumber, songName, songLength) {
    var template =
        '<tr class="album-view-song-item">'
        + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
        + '  <td class="song-item-title">' + songName + '</td>'
        + '  <td class="song-item-duration">' + songLength + '</td>'
        + '</tr>';
    
    var $row = $(template);
    
    var clickHandler = function () {
        var $songItem = $(this).find('.song-item-number'),
            songNumber = parseInt($songItem.attr('data-song-number'), 10);
        if (currentlyPlayingSongNumber === null) {
            $songItem.html(pauseButtonTemplate);
            setSong(songNumber);
            currentSoundFile.play();
            updateSeekBarWhileSongPlays();
            updateSeekPercentage($('.volume .seek-bar'), currentVolume / 100);
            updatePlayerBarSong();
        } else if (currentlyPlayingSongNumber === songNumber) {
            if (currentSoundFile.isPaused()) {
                currentSoundFile.play();
//                updateSeekBarWhileSongPlays();
                $songItem.html(pauseButtonTemplate);
                $('.main-controls a.play-pause').html(playerBarPauseButton);
            } else {
                currentSoundFile.pause();
                $songItem.html(playButtonTemplate);
                $('.main-controls a.play-pause').html(playerBarPlayButton);
            }
        } else if (currentlyPlayingSongNumber !== songNumber) {
            getSongNumberCell(currentlyPlayingSongNumber - 1).html(currentlyPlayingSongNumber);
            $songItem.html(pauseButtonTemplate);
            setSong(songNumber);
            currentSoundFile.play();
            updateSeekBarWhileSongPlays();
            updatePlayerBarSong();
        }
        
    };
    
    var onHover = function(event) {
        var $songItem = $(this).find('.song-item-number');
        var songNumber = parseInt($songItem.attr('data-song-number'), 10);
        if (songNumber !== currentlyPlayingSongNumber) {
            $songItem.html(playButtonTemplate);
        }
    };
    
    var offHover = function(event) {
        var $songItem = $(this).find('.song-item-number');
        var songNumber = parseInt($songItem.attr('data-song-number'), 10);
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

var updateSeekBarWhileSongPlays = function() {
  if (currentSoundFile) {
      currentSoundFile.bind('timeupdate', function(event) {
          var seekBarFillRatio = this.getTime() / this.getDuration();
          var $seekBar = $('.seek-control .seek-bar');
          
          updateSeekPercentage($seekBar, seekBarFillRatio);
      });
  }  
};

var updateSeekPercentage = function ($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
    
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString}); 
};

var setupSeekBars = function() {
    var $seekBars = $('.player-bar .seek-bar');
    
    $seekBars.click(function(event) {
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();
        var seekBarFillRatio = offsetX / barWidth;
        
        updateSeekPercentage($(this), seekBarFillRatio);
        console.log($(this).parent().hasClass('volume'));
        if ($(this).parent().hasClass('volume')) {
            setVolume(seekBarFillRatio * 100);
        } else if ($(this).parent().hasClass('seek-control')) {
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        }
    });
    
    $seekBars.find('.thumb').mousedown(function(event) {
        var $seekBar = $(this).parent();
        $(document).bind('mousemove.thumb', function(event) {
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;
            if ($seekBar.parent().hasClass('volume')) {
                setVolume(seekBarFillRatio * 100);
            } else if ($seekBar.parent().hasClass('seek-control')) {
                seek(seekBarFillRatio * currentSoundFile.getDuration());
            }
            updateSeekPercentage($seekBar, seekBarFillRatio);
        });
        $(document).bind('mouseup.thumb', function() {
            $(document).unbind('mousemove.thumb');
            $(document).unbind('mouseup.thumb');
        });
    });
};

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
};

var setSong = function(songNumber) {
    if (currentSoundFile) {
        currentSoundFile.stop();
    }
    currentlyPlayingSongNumber = songNumber;
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        formats: ['mp3'],
        preload: true,
        
    });
};

var getSongNumberCell = function(number) {
    return $songItemNumbers.eq(number);
};

var nextSong = function() {
    var nextSongIndex = (trackIndex(currentAlbum, currentSongFromAlbum) + 1) % currentAlbumLength;
    getSongNumberCell(currentlyPlayingSongNumber - 1).html(currentlyPlayingSongNumber);
    setSong(nextSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    getSongNumberCell(nextSongIndex).html(pauseButtonTemplate);
    updatePlayerBarSong();
    
};

var previousSong = function() {
    var prevSongIndex =  (currentAlbumLength + trackIndex(currentAlbum, currentSongFromAlbum) - 1) % currentAlbumLength;
    getSongNumberCell(currentlyPlayingSongNumber - 1).html(currentlyPlayingSongNumber);
    setSong(prevSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    getSongNumberCell(prevSongIndex).html(pauseButtonTemplate);
    updatePlayerBarSong();
};

var seek = function (time) {
    if (currentSoundFile) {
        currentSoundFile.setTime(time);
    }  
};

var setVolume = function(volume) {
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
        currentVolume = volume;
    }
};

var updatePlayerBarSong = function() {
    $('.currently-playing h2.song-name').text(currentSongFromAlbum.name);
    $('.currently-playing h2.artist-song-mobile').text( currentSongFromAlbum.name + " - " + currentAlbum.artist);
    $('.currently-playing h3.artist-name').text(currentAlbum.artist);
    $('.main-controls a.play-pause').html(playerBarPauseButton);
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentAlbum = null;
var currentAlbumLength = null;
var currentSoundFile = null;
var currentVolume = 80;
var $songItemNumbers;

var $previousButton = $('.main-controls a.previous');
var $nextButton = $('.main-controls a.next');

$(document).ready(function () {

    setCurrentAlbum(albumPicasso);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    $songItemNumbers = $('.album-view td.song-item-number');
    setupSeekBars();
});