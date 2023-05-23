let pokemonData = [];
let totalPairs = 0;
let matches = 0;
let pairsLeft = 0;
let time = 0;
let clicks = 0;
let timerInterval = null;
let firstCard = undefined;
let secondCard = undefined;

const updateTime = () => {
    time++;
    $("#timer").text(time);
    if (time >= 60) {
        clearInterval(timerInterval);
        alert("Took too long! Game over");
    }
};

const renderCards = () => {
    const gameGrid = $('#game_grid');
    pokemonData.forEach((pokemon, index) => {
        const card = $('<div>').addClass('card');
        const frontFace = $('<img>').addClass('front_face').attr('src', pokemon.imageFront).attr('id', `card${index}`);
        const backFace = $('<img>').addClass('back_face').attr('src', 'back.png');
        card.append(backFace, frontFace);
        gameGrid.append(card);
    });
    setup();
};

const setup = () => {
    $(".card").on("click", function () {
        if ($(this).hasClass("flip") || $(this).hasClass("matched") || $(".flip").length == 2) {
            return;
        }
        $(this).addClass("flip");
        clicks++;
        $("#clicks").text(clicks);

        if (!firstCard) {
            firstCard = $(this);
        } else {
            secondCard = $(this);
            if ($(firstCard).find(".front_face").attr('src') == $(secondCard).find(".front_face").attr('src')) {
                $(firstCard).addClass("matched").removeClass("flip");
                $(secondCard).addClass("matched").removeClass("flip");
                $(firstCard).off("click");
                $(secondCard).off("click");
                firstCard = undefined;
                secondCard = undefined;
                matches++;
                pairsLeft--;
                $("#matches").text(matches);
                $("#left").text(pairsLeft);
                if ($(".card:not(.matched)").length == 0) {
                    clearInterval(timerInterval);
                    setTimeout(() => {
                        alert("All cards matched! Time taken: " + time + " seconds");
                    }, 1000);
                }
            } else {
                setTimeout(() => {
                    $(firstCard).removeClass("flip");
                    $(secondCard).removeClass("flip");
                    firstCard = undefined;
                    secondCard = undefined;
                }, 1000);
            }
        }
    });
};

const getPokemonData = async (numCards) => {
    try {
        pokemonData = [];
        for (let i = 0; i < numCards; i++) {
            const randomId = Math.floor(Math.random() * 151) + 1;
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
            const pokeData = await res.json();
            const pokemon = {
                name: pokeData.name,
                url: pokeData.url,
                imageFront: pokeData.sprites.other["official-artwork"].front_default,
                imageBack: pokeData.sprites.other["official-artwork"].front_default
            };

            pokemonData.push(pokemon);
        }

        pokemonData = [...pokemonData, ...pokemonData];
        pokemonData.sort(() => Math.random() - 0.5);
        totalPairs = numCards;
        matches = 0;
        pairsLeft = numCards;
        $("#total").text(totalPairs);
        $("#matches").text(matches);
        $("#left").text(pairsLeft);
        renderCards();
        time = 0;
        $("#timer").text(time);
        timerInterval = setInterval(updateTime, 1000);
    } catch (error) {
        console.error('Error:', error);
    }
};

$(document).ready(function () {
    const theme = localStorage.getItem('theme') || 'Light';
    $("body").toggleClass("dark-mode", theme === 'Dark');

    $("#Powerup").click(function () {
        $(".card:not(.matched)").addClass("flip");
        setTimeout(function () {
            $(".card:not(.matched)").removeClass("flip");
        }, 2000);
        $(this).prop("disabled", true);
    });

    $("#option1").click(function () {
        $('#game_grid').empty();
        getPokemonData(2);
    });

    $("#option2").click(function () {
        $('#game_grid').empty();
        getPokemonData(3);
    });

    $("#option3").click(function () {
        $('#game_grid').empty();
        getPokemonData(4);
    });

    $("#start").click(function () {
        $(this).hide();
        $("#info").show();
        $("#game_grid").show();
        $("#themes").show();
    });

    $("a").click(function () {
        $("#start").show();
        $("#info").hide();
        $("#game_grid").hide();
        $("#themes").hide();
    });

    $("#Dark").click(function () {
        $("body").addClass("dark-mode");
        localStorage.setItem('theme', 'Dark');
    });

    $("#Light").click(function () {
        $("body").removeClass("dark-mode");
        localStorage.setItem('theme', 'Light');
    });
});
