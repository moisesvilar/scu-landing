var books = [
    {
        id: '1',
        title: 'demo',
        scenes: {
            'start': {
                text: `
                <p>La puerta de la casa se encuentra ante ti. Está cerrada.</p>
                <p>Escuchas los sonidos de la noche a tu espalda. Apoyas tu rostro en la ventana. Está helada.</p>
                <p>No puedes distinguir nada a través del velo opaco de la oscuridad.</p>
                <p>Tienes un mal presentimiento...</p>
                `,
                img: 'house-forest.jpg',
                actions: [
                    {
                        text: 'Llamas a la puerta',
                        href: 'llamar-puerta'
                    },
                    {
                        text: 'Tiras la puerta abajo',
                        href: 'tirar-puerta'
                    },
                    {
                        text: 'Echas un vistazo a tu espalda',
                        href: 'mirar-atras'
                    }
                ]

            },
            'llamar-puerta': {
                text: `
                <p>Golpeas con fuerza la madera vieja del portalón. Cruje bajo tus nudillos y el eco retumba en todo el bosque...</p>
                <p>Pasan algunos minutos, pero parece que nadie responde...</p>
                `,
                img: 'door.jpg',
                actions: [
                    {
                        text: 'Tiras la puerta abajo',
                        href: 'tirar-puerta'
                    },
                    {
                        text: 'Echas un vistazo a tu espalda',
                        href: 'mirar-atras'
                    }
                ]
            },
            'tirar-puerta': {
                'text': `
                <p>Das dos pasos atrás y coges impulso. Con ímpetu, estrellas tu hombro contra la puerta... Una vez... Dos veces...</p>
                <p>En el tercer impacto la madera cruje violentamente y los goznes ceden. Trastabillas y a punto estás de perder el equilibrio.</p>
                <p>Notas el aire frío, húmedo y pegajoso que proviene del interior de la casa... y algo que parecen ser pasos...</p>
                `,
                img: 'door.jpg',
                actions: [
                    {
                        text: 'Anuncias a gritos tu llegada',
                        href: ''
                    },
                    {
                        text: 'Mantienes silencio para oir mejor esos pasos',
                        href: ''
                    },
                ]
            },
            'mirar-atras': {
                text: `
                <p>El bosque está en una calma tensa. La niebla avanza como un manto onírico entre los árboles. El viento susurra entre las ramas.</p>
                <p>Un par de ojos brillantes te observan, seguramente de alguna alimaña. Parpadeas y ya no están allí.</p>
                <p>Vuelves a concentrarte en la puerta, mientras te preguntas con preocupación si conoces alguna alimaña que se mueva tan rápido.</p>
                `,
                img: 'forest.jpg',
                actions: [
                    {
                        text: 'Llamas a la puerta',
                        href: 'llamar-puerta'
                    },
                    {
                        text: 'Tiras la puerta abajo',
                        href: 'tirar-puerta'
                    }
                ]
            }
        }
    }
];

var actionTemplate = `<a href='{href}' class='btn action'>{text}</a>`;

preloadImages();

function preloadImages() {
    books.forEach(function(book) {
        var scenes = book.scenes;
        for (var prop in scenes) {
            var scene = scenes[prop];
            if (scene.img) {
                var img = new Image();
                img.src = getFullPathToImage(scene.img);
            }
        }
    });
}

$(document).ready(function() {
    setMailAnchors();
    setCookies();
    var book = chooseRandomBook();
    setActionsHandler(book);
});

function setMailAnchors() {
    var $mailAnchors = $('a.email');
    $mailAnchors.on('hover', function() {
        var $mailAnchor = $(this);
        var user = $mailAnchor.data('user');
        var domain = $mailAnchor.data('domain');
        var emailAddress = `${user}@${domain}`;
        $mailAnchor.attr('href', `mailto:${emailAddress}`);
    });
}

function setCookies() {
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

function chooseRandomBook() {
    var index = Math.floor(Math.random() * books.length);
    return books[index];
}

function setActionsHandler(book) {
    var scenes = book.scenes;
    var $header = $('#header');
    var scene = book.scenes['start'];
    if (!scene) {
        return;
    }
    var actionsHtml = getActionsFromScene(scene);
    changeStory(book, scene, actionsHtml);
    var $actionsAnchors = $header.find('.actions').find('a');
    $actionsAnchors.click(function(e) {
        performClickOnAction(e, this, scenes, book);
    });
}

function performClickOnAction(e, _this, scenes, book) {
    e.preventDefault();
    var $action = $(_this);
    var href = $action.attr('href');
    var scene = scenes[href];
    if (!scene) {
        return;
    }
    var actionsHtml = getActionsFromScene(scene);
    changeStory(book, scene, actionsHtml);
    var $actionsAnchors = $('#header').find('.actions').find('a');
    $actionsAnchors.click(function(e) {
        performClickOnAction(e, this, scenes, book);
    });
}

function getActionsFromScene(scene) {
    var actionsHtml = '';
    scene.actions.forEach(function(action) {
        var actionHtml = actionTemplate.replace('{href}', action.href).replace('{text}', action.text);
        actionsHtml += actionHtml;
    });
    return actionsHtml;
}

function changeStory(book, scene, actions) {
    var $header = $('#header');
    var $story = $header.find('.story');
    var $slogan = $header.find('.slogan');
    var $actions = $header.find('.actions');
    $slogan.html(scene.text);
    $actions.html(actions);
    changeImage(scene.img);
}

function getFullPathToImage(img) {
    return `assets/images/${img}`;
}

function changeImage(img) {
    var $header = $('#header');
    var backgroundValue = `url("${getFullPathToImage(img)}") no-repeat center center`;
    $header.css('background', backgroundValue);
    $header.css('background-size', 'cover');
}