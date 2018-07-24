(function($) {

    $.fn.game = function() {

        var audio = $("#audio")[0];

        var score = 0; // Счет

        var shuffled_cards = []; // Массив карт, лежащих на столе

        // Все карты колоды
        var cards = [
            { "id": "100", "image": "src/Cards/0C.png" },
            { "id": "101", "image": "src/Cards/0D.png" },
            { "id": "102", "image": "src/Cards/0H.png" },
            { "id": "103", "image": "src/Cards/0S.png" },
            { "id": "104", "image": "src/Cards/2C.png" },
            { "id": "105", "image": "src/Cards/2D.png" },
            { "id": "106", "image": "src/Cards/2H.png" },
            { "id": "107", "image": "src/Cards/2S.png" },
            { "id": "108", "image": "src/Cards/3C.png" },
            { "id": "109", "image": "src/Cards/3D.png" },
            { "id": "110", "image": "src/Cards/3H.png" },
            { "id": "111", "image": "src/Cards/3S.png" },
            { "id": "112", "image": "src/Cards/4C.png" },
            { "id": "113", "image": "src/Cards/4D.png" },
            { "id": "114", "image": "src/Cards/4H.png" },
            { "id": "115", "image": "src/Cards/4S.png" },
            { "id": "116", "image": "src/Cards/5C.png" },
            { "id": "117", "image": "src/Cards/5D.png" },
            { "id": "118", "image": "src/Cards/5H.png" },
            { "id": "119", "image": "src/Cards/5S.png" },
            { "id": "120", "image": "src/Cards/6C.png" },
            { "id": "121", "image": "src/Cards/6D.png" },
            { "id": "122", "image": "src/Cards/6H.png" },
            { "id": "123", "image": "src/Cards/6S.png" },
            { "id": "124", "image": "src/Cards/7C.png" },
            { "id": "125", "image": "src/Cards/7D.png" },
            { "id": "126", "image": "src/Cards/7H.png" },
            { "id": "127", "image": "src/Cards/7S.png" },
            { "id": "128", "image": "src/Cards/8C.png" },
            { "id": "129", "image": "src/Cards/8D.png" },
            { "id": "130", "image": "src/Cards/8H.png" },
            { "id": "131", "image": "src/Cards/8S.png" },
            { "id": "132", "image": "src/Cards/9C.png" },
            { "id": "133", "image": "src/Cards/9D.png" },
            { "id": "134", "image": "src/Cards/9H.png" },
            { "id": "135", "image": "src/Cards/9S.png" },
            { "id": "136", "image": "src/Cards/AC.png" },
            { "id": "137", "image": "src/Cards/AD.png" },
            { "id": "138", "image": "src/Cards/AH.png" },
            { "id": "139", "image": "src/Cards/AS.png" },
            { "id": "140", "image": "src/Cards/JC.png" },
            { "id": "141", "image": "src/Cards/JD.png" },
            { "id": "142", "image": "src/Cards/JH.png" },
            { "id": "143", "image": "src/Cards/JS.png" },
            { "id": "144", "image": "src/Cards/KC.png" },
            { "id": "145", "image": "src/Cards/KD.png" },
            { "id": "146", "image": "src/Cards/KH.png" },
            { "id": "147", "image": "src/Cards/KS.png" },
            { "id": "148", "image": "src/Cards/QC.png" },
            { "id": "149", "image": "src/Cards/QD.png" },
            { "id": "150", "image": "src/Cards/QH.png" },
            { "id": "151", "image": "src/Cards/QS.png" }
        ];

        // Создание набора карт
        var shuffle = function() {
            shuffled_cards = [];
            var ids = []; // массив для индексов отбора карт из массива "cards"
            var id;
            while (ids.length < 9) {
                id = Math.round(Math.random() * 51);
                if (ids.indexOf(id) === -1) {
                    ids.push(id);
                }
            }
            for (var i = 0; i < 9; i++) {
                shuffled_cards.push(cards[ids[i]]);
            };
            shuffled_cards = shuffled_cards.concat(shuffled_cards).sort(function() {
                return 0.5 - Math.random();
            }); // Дублирование карт для получения пары и перемешивание
        };

        // Добавление набора карт на игровой стол
        var insertCards = function() {
            var cards = $(".front");
            cards.each(function(index) {
                $(this).attr("src", shuffled_cards[index].image);
                $(this).parent().attr("id-card", shuffled_cards[index].id);
            });
        };

        // Обновление счета
        var updateScore = function() {
            $("#score, #full-score").html(score);
        };

        // Проверка наличия оставшихся на столе карт
        var checkEndGame = function() {
            if ($(".unmatched").length === 0) { // если карты закончились
                $(".game-window").hide(); // скрываем игровой стол
                $(".end-game-window").show(); // показываем итоговый счет
                $(".card").off("click"); // запрет кликов по скрытым картам
                audio.play();
            }
        };

        // Проверка совпадения выбранных карт
        var checkMatch = function() {
            if ($(".selected").length === 2) {
               $(".card").off("click"); // Блокируем клик по остальным картам
                if ($(".selected").first().attr("id-card") === $(".selected").last().attr("id-card")) { // Если карты совпали
                    setTimeout(function() {
                        $(".selected").each(function() {
                            $(this).removeClass("selected unmatched").addClass("matched"); // скрываем их
                        });
                        clickHandler(); // Возвращаем клик по картам
                        score += $(".unmatched").length / 2 * 42; // Начисляем очки
                        updateScore();
                        checkEndGame();
                    }, 500);
                } else {
                    setTimeout(function() {
                        $(".selected").each(function() { // Если карты не совпали
                            $(this).removeClass("selected").toggleClass("flipped"); // переворачиваем рубашкой вверх
                        });
                        clickHandler();  // Возвращаем клик по картам
                        score -= $(".matched").length / 2 * 42;
                        updateScore();
                    }, 500);
                }
            }
        };

        // Клик по карте
        var clickHandler = function() {
            $(".card").on("click", function() {
                $(this).toggleClass("selected flipped"); // Переворачиваем рубашкой вниз
                checkMatch();
            });
        };

        // Обнуление счета
        var clearScore = function() {
            score = 0;
            $("#score, #full-score").html(score);
        };

        // Старт игры
        var start = function() {
            shuffle(); // Создаем набор карт
            insertCards(); // Добавляем их на стол
            $(".start-game-window").hide(); // Скрываем окно начала игры
            $(".game-window").show(); // Показываем игровой стол
            setTimeout(function() {
                $(".card").toggleClass("flipped"); // Через 5 секунд переворачиваем карты рубашкой вверх
                clickHandler(); // Разрешаем клики по картам
            }, 5000);
        };

        // Запуск новой игры
        var endRetryGame = function() {
            audio.pause(); // Останавливаем финальное аудио
            audio.currentTime = 0; // Устанавливаем аудио на начало
            $(".end-game-window").hide(); // Скрываем финиальное окно
            clearScore(); // Обнуляем счет
            $(".card").addClass("unmatched").removeClass("matched"); // Возвращаем картам исходное состояние
            start(); // Запускаем игру
        };

        // Перезапуск текущей игры
        var menuRetryGame = function() {
            clearScore(); // Обнуляем счет
            $(".card").removeClass("flipped matched"); // Возвращаем картам исходное состояние
            window.setTimeout(function() {
                $(".card").toggleClass("flipped"); // Переворачиваем через 5 секунд рубашкой вверх
            }, 5000);
        };

        // Инициализация игры
        var init = function() {
            $(".btn-start").on("click", start);
            $(".btn-menu-start").on("click", menuRetryGame);
            $(".btn-end-start").on("click", endRetryGame);
        };

        init();

    };
}(jQuery));