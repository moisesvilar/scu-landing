$(document).ready(function() {
    new IndexController();
});

function IndexController() {
    this.setMailAnchors();
    this.setCookies();
    this.bookService = new BookService();
    this.databaseService = new DatabaseService();
    this.book = this.bookService.getRandomBook();
    this.preloadImages(this.book);
    this.initStory(this.book);
    this.setContactForm();
    this.setGaEvents();
}

IndexController.ACTION_TEMPLATE = `<a href='{href}' id='{id}' class='btn action'>{text}</a>`;
IndexController.SUBMIT_TEXT_IN_SENDING_STATE = 'Un segundo...';

IndexController.prototype.preloadImages = function(book) {
    var scenes = book.scenes;
    for (var prop in scenes) {
        var scene = scenes[prop];
        if (scene.img) {
            var img = new Image();
            img.src = this.getFullPathToImage(scene.img);
        }
    }
};

IndexController.prototype.setMailAnchors = function() {
    var $mailAnchors = $('a.email');
    $mailAnchors.on('hover', function() {
        var $mailAnchor = $(this);
        var user = $mailAnchor.data('user');
        var domain = $mailAnchor.data('domain');
        var emailAddress = `${user}@${domain}`;
        $mailAnchor.attr('href', `mailto:${emailAddress}`);
    });
};

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
};

IndexController.prototype.initStory = function(book) {
    var scenes = book.scenes;
    var $header = $('#header');
    var sceneId = 'start';
    var scene = book.scenes[sceneId];
    if (!scene) {
        return;
    }
    var actionsHtml = this.getActionsFromScene(scene, sceneId);
    this.changeStory(book, scene, actionsHtml);
    var $actionsAnchors = $header.find('.actions').find('a');
    var self = this;
    $actionsAnchors.click(function(e) {
        self.performClickOnAction(e, this, scenes, book);
    });
};

IndexController.prototype.getActionsFromScene = function(scene, sceneId) {
    var actionsHtml = '';
    scene.actions = scene.actions || [];
    scene.actions.forEach(function(action, index) {
        var id = `${sceneId}-${action.text}-${index}`;
        var actionHtml = IndexController.ACTION_TEMPLATE.replace('{href}', action.href).replace('{id}', id).replace('{text}', action.text);
        actionsHtml += actionHtml;
    });
    return actionsHtml;
};

IndexController.prototype.changeStory = function(book, scene, actionsHtml) {
    var $header = $('#header');
    var $story = $header.find('.story');
    var $slogan = $header.find('.slogan');
    var $actions = $header.find('.actions');
    $slogan.html(scene.text);
    $actions.html(actionsHtml);
    this.showCallToActionIfEndingScene(scene);
    this.changeImage(scene.img);
};

IndexController.prototype.changeImage = function(img) {
    var $header = $('#header');
    var backgroundValue = `url("${this.getFullPathToImage(img)}") no-repeat center center`;
    $header.css('background', backgroundValue);
    $header.css('background-size', 'cover');
};

IndexController.prototype.getFullPathToImage = function(img) {
    return `assets/images/${img}`;
};

IndexController.prototype.performClickOnAction = function(e, _this, scenes, book) {
    e.preventDefault();
    var $action = $(_this);
    var href = $action.attr('href');
    var id = $action.attr('id');
    this.sendGaEvent('story', 'choices', id);
    var scene = scenes[href];
    if (!scene) {
        return;
    }
    var actionsHtml = this.getActionsFromScene(scene, href);
    this.changeStory(book, scene, actionsHtml);
    var $actionsAnchors = $('#header').find('.actions').find('a');
    var self = this;
    $actionsAnchors.click(function(e) {
        self.performClickOnAction(e, this, scenes, book);
    });
};

IndexController.prototype.showCallToActionIfEndingScene = function(scene) {
    if (scene.end === true) {
        $('#call-to-action').removeClass('hidden');
    }
};

IndexController.prototype.setContactForm = function () {
    const self = this;
    $('.email-form').submit(function(e) {
        e.preventDefault();
        self.putFormInSendingState(this);
        self.sendEmail(this);
        return false;
    });
};

IndexController.prototype.putFormInSendingState = function(form) {
    const $form = $(form);
    const $submit = $form.find('input[type=submit]');
    $submit.prop('disabled', true);
    $submit.val(IndexController.SUBMIT_TEXT_IN_SENDING_STATE);
};

IndexController.prototype.putFormInSentState = function(form) {
    const $form = $(form);
    const $notSending = $form.closest('#not-sending');
    const $sent = $form.closest('#contact').find('#sent');
    $notSending.fadeOut();
    $sent.fadeIn();
};

IndexController.prototype.sendEmail = function(form) {
    const $form = $(form);
    const email = $form.find('#email_address').val();
    const self = this;
    this.databaseService.writeEmail(email).then(function() {
        self.putFormInSentState(form);      
    });
};

IndexController.prototype.sendGaEvent = function(category, event, value) {
    console.log(`send event ${category} ${event} ${value}`);
    ga('send', 'event', category, event, value);
};

IndexController.prototype.setGaEvents = function() {
    this.setGaEventInScrollButton();
    this.setGaEventInToggleSideMenu();
    this.setGaEventsInSideMenuLinks();
    this.setGaEventsInCallToActions();
};

IndexController.prototype.setGaEventInScrollButton = function() {
    var self = this;
    $('#scrollToContent').click(function() {
        self.sendGaEvent('navigation', 'click', 'scroll to content');
    });
};

IndexController.prototype.setGaEventInToggleSideMenu = function() {
    var self = this;
    $('#openSideMenu').click(function() {
        self.sendGaEvent('navigation', 'click', 'open side menu');
    });
    $('#closeSideMenu').click(function() {
        self.sendGaEvent('navigation', 'click', 'close side menu');
    });
};

IndexController.prototype.setGaEventsInSideMenuLinks = function() {
    var self = this;
    $('#drawer-right').find('li > a').click(function() {
        var $link = $(this);
        self.sendGaEvent('navigation', 'click', `side menu link: ${$link.attr('href')}`);
    });
};

IndexController.prototype.setGaEventsInCallToActions = function() {
    var self = this;
    $('#call-to-action').find('a').click(function() {
        self.sendGaEvent('navigation', 'click', 'call to action at the end of the story');
    });
    $('#concepto').find('a').click(function() {
        self.sendGaEvent('navigation', 'click', 'call to action at concept section');
    });
};