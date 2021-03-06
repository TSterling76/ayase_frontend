var thumbs = {};

thumbs.init = function() {

  thumbs.playableTypes = [ 'video/webm', 'audio/mpeg', 'video/mp4',
      'video/ogg', 'audio/ogg', 'audio/webm' ];

  thumbs.videoTypes = [ 'video/webm', 'video/mp4', 'video/ogg' ];

  var imageLinks = document.getElementsByClassName('imgLink');

  var temporaryImageLinks = [];

  for (var i = 0; i < imageLinks.length; i++) {
    temporaryImageLinks.push(imageLinks[i]);
  }

  for (i = 0; i < temporaryImageLinks.length; i++) {
    thumbs.processImageLink(temporaryImageLinks[i]);
  }
};

thumbs.expandImage = function(mouseEvent, link, mime) {

  if (mouseEvent.which === 2 || mouseEvent.ctrlKey) {
    return true;
  }

  var thumb = link.getElementsByTagName('img')[0];

  if (thumb.style.display === 'none') {
    link.getElementsByClassName('imgExpanded')[0].style.display = 'none';
    thumb.style.display = '';
    thumb.scrollIntoView();
    return false;
  }

  var expanded = link.getElementsByClassName('imgExpanded')[0];

  if (expanded) {
    thumb.style.display = 'none';
    expanded.style.display = '';
    return false;
  } else {
    var expandedSrc = link.href;

    if (thumb.src === expandedSrc && mime !== 'image/svg+xml') {
      return false;
    }

    expanded = document.createElement('img');
    expanded.setAttribute('src', expandedSrc);
    expanded.className = 'imgExpanded';

    thumb.style.display = 'none';
    link.appendChild(expanded);
    return false;
  }

};

thumbs.setPlayer = function(link, mime) {

  var path = link.href;
  var parent = link.parentNode;

  var src = document.createElement('source');
  src.setAttribute('src', link.href);
  src.setAttribute('type', mime);

  var video = document
      .createElement(thumbs.videoTypes.indexOf(mime) > -1 ? 'video' : 'audio');
  video.setAttribute('controls', true);
  video.style.display = 'none';

  var videoContainer = document.createElement('span');

  var hideLink = document.createElement('a');
  hideLink.innerHTML = '[ - ]';
  hideLink.style.cursor = 'pointer';
  hideLink.style.display = 'none';
  hideLink.className = 'hideLink';
  hideLink.onclick = function() {
    newThumb.style.display = 'inline';
    video.style.display = 'none';
    hideLink.style.display = 'none';
    video.pause();
  };

  var newThumb = document.createElement('img');
  newThumb.className = 'imgLink';
  newThumb.src = link.childNodes[0].src;
  newThumb.onclick = function() {
    if (!video.childNodes.count) {
      video.appendChild(src);
    }

    newThumb.style.display = 'none';
    video.style.display = 'inline';
    hideLink.style.display = 'inline';
    video.play();
  };
  newThumb.style.cursor = 'pointer';

  videoContainer.appendChild(hideLink);
  videoContainer.appendChild(video);
  videoContainer.appendChild(newThumb);

  parent.replaceChild(videoContainer, link);

};

thumbs.processImageLink = function(link) {

  var mime = link.dataset.filemime;

  if (mime.indexOf('image/') > -1) {

    link.onclick = function(mouseEvent) {
      return thumbs.expandImage(mouseEvent, link, mime);
    };

  } else if (thumbs.playableTypes.indexOf(mime) > -1) {
    thumbs.setPlayer(link, mime);
  }
};

thumbs.init();