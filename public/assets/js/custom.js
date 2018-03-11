var scenes = {
    'llamar-puerta': {
        'text': `
        <p>
        Golpeas con fuerza la madera vieja del portalón. Cruje bajo tus nudillos y el eco retumba en todo el bosque...
        </p>
        <p>
        Pasan algunos minutos, pero parece que nadie responde...
        </p>
        `,
        'actions': [
            {
                'text': 'Tiras la puerta abajo',
                'href': 'tirar-puerta'
            },
            {
                'text': 'Echas un vistazo a tu espalda',
                'href': 'mirar-atras'
            }
        ]
    },
    'tirar-puerta': {
        'text': `
        <p>
        Das dos pasos atrás y coges impulso. Con ímpetu, estrellas tu hombro contra la puerta... Una vez... Dos veces...
        </p>
        <p>
        En el tercer impacto la madera cruje violentamente y los goznes ceden. Trastabillas y a punto estás de perder el equilibrio.
        Notas el aire frío, húmedo y pegajoso que proviene del interior de la casa... y algo que parecen ser pasos...
        </p>
        `,
        'actions': [
            {
                'text': 'Anuncias a gritos tu llegada',
                'href': ''
            },
            {
                'text': 'Mantienes silencio para oir mejor esos pasos',
                'href': ''
            },
        ]
    },
    'mirar-atras': {
        'text': `
        <p>
        El bosque está en una calma tensa. La niebla avanza como un manto onírico entre los árboles. El viento susurra entre las ramas.
        Un par de ojos brillantes te observan, seguramente de alguna alimaña. Parpadeas y ya no están allí.
        </p>
        <p>
        Vuelves a concentrarte en la puerta, mientras te preguntas con preocupación si conoces alguna alimaña que se mueva tan rápido.
        </p>
        `,
        'actions': [
            {
                'text': 'Llamas a la puerta',
                'href': 'llamar-puerta'
            },
            {
                'text': 'Tiras la puerta abajo',
                'href': 'tirar-puerta'
            }
        ]
    }
};

var actionTemplate = `<a href='{href}' class='btn action'>{text}</a>`;

$(document).ready(function() {   
    $.fn.extend({
        animateCss: function(animationName, callback) {
            var animationEnd = (function(el) {
            var animations = {
                animation: 'animationend',
                OAnimation: 'oAnimationEnd',
                MozAnimation: 'mozAnimationEnd',
                WebkitAnimation: 'webkitAnimationEnd',
            };
        
            for (var t in animations) {
                if (el.style[t] !== undefined) {
                return animations[t];
                }
            }
            })(document.createElement('div'));
        
            this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
        
            if (typeof callback === 'function') callback();
            });
        
            return this;
        },
    });
    setActionsHandler();
});

function setActionsHandler() {
    var $header = $('#header');
    var $actionsAnchors = $header.find('.actions').find('a');
    $actionsAnchors.click(function(e) {
        e.preventDefault();
        var $action = $(this);
        var href = $action.attr('href');
        var scene = scenes[href];
        if (!scene) {
            return;
        }
        var actionsHtml = '';
        scene.actions.forEach(function(action) {
            var actionHtml = actionTemplate.replace('{href}', action.href).replace('{text}', action.text);
            actionsHtml += actionHtml;
        });
        changeStory(scene.text, actionsHtml, `scene-${href}`);
    });
}

function changeStory(text, actions, clazz) {
    var $header = $('#header');
    var $story = $header.find('.story');
    var $slogan = $header.find('.slogan');
    var $actions = $header.find('.actions');
    $header.removeClass (function (index, className) {
        return (className.match (/scene-\S+/g) || []).join(' ');
    });
    $header.addClass(clazz);
    $story.animateCss('fadeOut', function() {
        $slogan.html(text);
        $actions.html(actions);
        setActionsHandler();
        $story.animateCss('fadeIn');
    });
}