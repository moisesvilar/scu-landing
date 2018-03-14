$(document).ready(function() {
    new IndexController();
});

function IndexController() {
    this.setMailAnchors();
    this.setCookies();
    this.bookService = new BookService();
    this.book = this.bookService.getRandomBook();
    this.preloadImages(this.book);
    this.initStory(this.book);
}

IndexController.ACTION_TEMPLATE = `<a href='{href}' class='btn action'>{text}</a>`;

IndexController.prototype.preloadImages = function(book) {
    var scenes = book.scenes;
    for (var prop in scenes) {
        var scene = scenes[prop];
        if (scene.img) {
            var img = new Image();
            img.src = this.getFullPathToImage(scene.img);
        }
    }
}

IndexController.prototype.setMailAnchors = function() {
    var $mailAnchors = $('a.email');
    $mailAnchors.on('hover', function() {
        var $mailAnchor = $(this);
        var user = $mailAnchor.data('user');
        var domain = $mailAnchor.data('domain');
        var emailAddress = `${user}@${domain}`;
        $mailAnchor.attr('href', `mailto:${emailAddress}`);
    });
}

IndexController.prototype.setCookies = function() {
    var $cookies = $('.cookies');
    var currentCookieValue = cookie.get('cookies');
    if (currentCookieValue === 'true') {
        $cookies.hide();
    }
    else {
        $cookies.find('.cclose').click(function(e) {
            e.preventDefault();
            cookie.set('cookies', 'true', { expires: 365 });
            $(this).closest('.cookies').hide();
        });
    }
}

IndexController.prototype.initStory = function(book) {
    var scenes = book.scenes;
    var $header = $('#header');
    var scene = book.scenes['start'];
    if (!scene) {
        return;
    }
    var actionsHtml = this.getActionsFromScene(scene);
    this.changeStory(book, scene, actionsHtml);
    var $actionsAnchors = $header.find('.actions').find('a');
    var self = this;
    $actionsAnchors.click(function(e) {
        self.performClickOnAction(e, this, scenes, book);
    });
}

IndexController.prototype.getActionsFromScene = function(scene) {
    var actionsHtml = '';
    scene.actions.forEach(function(action) {
        var actionHtml = IndexController.ACTION_TEMPLATE.replace('{href}', action.href).replace('{text}', action.text);
        actionsHtml += actionHtml;
    });
    return actionsHtml;
}

IndexController.prototype.changeStory = function(book, scene, actionsHtml) {
    var $header = $('#header');
    var $story = $header.find('.story');
    var $slogan = $header.find('.slogan');
    var $actions = $header.find('.actions');
    $slogan.html(scene.text);
    $actions.html(actionsHtml);
    this.changeImage(scene.img);
}

IndexController.prototype.changeImage = function(img) {
    var $header = $('#header');
    var backgroundValue = `url("${this.getFullPathToImage(img)}") no-repeat center center`;
    $header.css('background', backgroundValue);
    $header.css('background-size', 'cover');
}

IndexController.prototype.getFullPathToImage = function(img) {
    return `assets/images/${img}`;
}

IndexController.prototype.performClickOnAction = function(e, _this, scenes, book) {
    e.preventDefault();
    var $action = $(_this);
    var href = $action.attr('href');
    var scene = scenes[href];
    if (!scene) {
        return;
    }
    var actionsHtml = this.getActionsFromScene(scene);
    this.changeStory(book, scene, actionsHtml);
    var $actionsAnchors = $('#header').find('.actions').find('a');
    var self = this;
    $actionsAnchors.click(function(e) {
        self.performClickOnAction(e, this, scenes, book);
    });
}