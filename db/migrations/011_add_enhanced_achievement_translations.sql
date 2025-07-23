-- Migration: Add Enhanced Achievement Translations
-- Description: Adds translations for all new enhanced achievements in all 14 supported languages

-- =============================================
-- Performance & Skill Achievement Translations
-- =============================================

-- Sharpshooter Achievement Translations
INSERT OR IGNORE INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_accuracy_95', 'de', 'Scharfschütze', 'Erreiche 95% Genauigkeit in einem Spiel'),
('ach_accuracy_95', 'en', 'Sharpshooter', 'Achieve 95% accuracy in a game'),
('ach_accuracy_95', 'es', 'Tirador Experto', 'Logra 95% de precisión en un juego'),
('ach_accuracy_95', 'fr', 'Tireur d''élite', 'Atteins 95% de précision dans un jeu'),
('ach_accuracy_95', 'it', 'Cecchino', 'Raggiungi il 95% di precisione in una partita'),
('ach_accuracy_95', 'pt', 'Atirador de Elite', 'Alcance 95% de precisão em um jogo'),
('ach_accuracy_95', 'da', 'Skarpskytte', 'Opnå 95% nøjagtighed i et spil'),
('ach_accuracy_95', 'nl', 'Scherpschutter', 'Behaal 95% nauwkeurigheid in een spel'),
('ach_accuracy_95', 'sv', 'Prickskytt', 'Uppnå 95% träffsäkerhet i ett spel'),
('ach_accuracy_95', 'fi', 'Tarkka-ampuja', 'Saavuta 95% tarkkuus pelissä'),
('ach_accuracy_95', 'cn', '神枪手', '在游戏中达到95%的准确率'),
('ach_accuracy_95', 'ru', 'Снайпер', 'Достигните 95% точности в игре'),
('ach_accuracy_95', 'jp', '狙撃手', 'ゲームで95%の精度を達成する'),
('ach_accuracy_95', 'uk', 'Снайпер', 'Досягніть 95% точності в грі');

-- Lightning Fast Achievement Translations
INSERT OR IGNORE INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_speed_lightning', 'de', 'Blitzschnell', 'Beantworte alle Fragen in unter 5 Sekunden'),
('ach_speed_lightning', 'en', 'Lightning Fast', 'Answer all questions under 5 seconds'),
('ach_speed_lightning', 'es', 'Rápido como el Rayo', 'Responde todas las preguntas en menos de 5 segundos'),
('ach_speed_lightning', 'fr', 'Rapide comme l''éclair', 'Réponds à toutes les questions en moins de 5 secondes'),
('ach_speed_lightning', 'it', 'Veloce come un Fulmine', 'Rispondi a tutte le domande in meno di 5 secondi'),
('ach_speed_lightning', 'pt', 'Rápido como um Raio', 'Responda todas as perguntas em menos de 5 segundos'),
('ach_speed_lightning', 'da', 'Lynhurtig', 'Besvar alle spørgsmål på under 5 sekunder'),
('ach_speed_lightning', 'nl', 'Bliksemsnell', 'Beantwoord alle vragen onder de 5 seconden'),
('ach_speed_lightning', 'sv', 'Blixtsnabb', 'Besvara alla frågor under 5 sekunder'),
('ach_speed_lightning', 'fi', 'Salamannopea', 'Vastaa kaikkiin kysymyksiin alle 5 sekunnissa'),
('ach_speed_lightning', 'cn', '闪电般快速', '在5秒内回答所有问题'),
('ach_speed_lightning', 'ru', 'Молниеносный', 'Ответьте на все вопросы менее чем за 5 секунд'),
('ach_speed_lightning', 'jp', '稲妻の速さ', 'すべての質問を5秒以内に答える'),
('ach_speed_lightning', 'uk', 'Блискавично швидкий', 'Дайте відповіді на всі питання менш ніж за 5 секунд');

-- Perfectionist Achievement Translations
INSERT OR IGNORE INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_perfect_streak_3', 'de', 'Perfektionist', 'Erreiche 3 perfekte Spiele in Folge'),
('ach_perfect_streak_3', 'en', 'Perfectionist', 'Achieve 3 perfect games in a row'),
('ach_perfect_streak_3', 'es', 'Perfeccionista', 'Logra 3 juegos perfectos consecutivos'),
('ach_perfect_streak_3', 'fr', 'Perfectionniste', 'Réalise 3 jeux parfaits d''affilée'),
('ach_perfect_streak_3', 'it', 'Perfezionista', 'Ottieni 3 partite perfette di fila'),
('ach_perfect_streak_3', 'pt', 'Perfeccionista', 'Alcance 3 jogos perfeitos seguidos'),
('ach_perfect_streak_3', 'da', 'Perfektionist', 'Opnå 3 perfekte spil i træk'),
('ach_perfect_streak_3', 'nl', 'Perfectionist', 'Behaal 3 perfecte spellen op rij'),
('ach_perfect_streak_3', 'sv', 'Perfectionist', 'Uppnå 3 perfekta spel i rad'),
('ach_perfect_streak_3', 'fi', 'Perfektionisti', 'Saavuta 3 täydellistä peliä peräkkäin'),
('ach_perfect_streak_3', 'cn', '完美主义者', '连续达成3场完美游戏'),
('ach_perfect_streak_3', 'ru', 'Перфекционист', 'Достигните 3 идеальных игр подряд'),
('ach_perfect_streak_3', 'jp', '完璧主義者', '3回連続で完璧なゲームを達成する'),
('ach_perfect_streak_3', 'uk', 'Перфекціоніст', 'Досягніть 3 ідеальних ігор поспіль');

-- Speed Demon Achievement Translations
INSERT OR IGNORE INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_speed_demon', 'de', 'Geschwindigkeitsdämon', 'Durchschnittliche Antwortzeit unter 3 Sekunden über 20 Spiele'),
('ach_speed_demon', 'en', 'Speed Demon', 'Average answer time under 3 seconds over 20 games'),
('ach_speed_demon', 'es', 'Demonio de la Velocidad', 'Tiempo promedio de respuesta bajo 3 segundos en 20 juegos'),
('ach_speed_demon', 'fr', 'Démon de la Vitesse', 'Temps de réponse moyen sous 3 secondes sur 20 jeux'),
('ach_speed_demon', 'it', 'Demone della Velocità', 'Tempo medio di risposta sotto 3 secondi su 20 partite'),
('ach_speed_demon', 'pt', 'Demônio da Velocidade', 'Tempo médio de resposta abaixo de 3 segundos em 20 jogos'),
('ach_speed_demon', 'da', 'Hastighedsdæmon', 'Gennemsnitlig svartid under 3 sekunder over 20 spil'),
('ach_speed_demon', 'nl', 'Snelheidsdemon', 'Gemiddelde antwoordtijd onder 3 seconden over 20 spellen'),
('ach_speed_demon', 'sv', 'Hastighetsdemon', 'Genomsnittlig svarstid under 3 sekunder över 20 spel'),
('ach_speed_demon', 'fi', 'Nopeusdemoni', 'Keskimääräinen vastausaika alle 3 sekuntia 20 pelissä'),
('ach_speed_demon', 'cn', '速度恶魔', '在20场游戏中平均回答时间少于3秒'),
('ach_speed_demon', 'ru', 'Демон скорости', 'Среднее время ответа менее 3 секунд за 20 игр'),
('ach_speed_demon', 'jp', 'スピードデーモン', '20ゲームで平均回答時間3秒未満'),
('ach_speed_demon', 'uk', 'Демон швидкості', 'Середній час відповіді менше 3 секунд за 20 ігор');

-- =============================================
-- Time-based Achievement Translations
-- =============================================

-- Marathon Player Achievement Translations
INSERT OR IGNORE INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_marathon_player', 'de', 'Marathon-Spieler', 'Spiele 50 Spiele an einem Tag'),
('ach_marathon_player', 'en', 'Marathon Player', 'Play 50 games in one day'),
('ach_marathon_player', 'es', 'Jugador Maratonista', 'Juega 50 partidas en un día'),
('ach_marathon_player', 'fr', 'Joueur Marathon', 'Joue 50 jeux en une journée'),
('ach_marathon_player', 'it', 'Giocatore Maratona', 'Gioca 50 partite in un giorno'),
('ach_marathon_player', 'pt', 'Jogador Maratonista', 'Jogue 50 jogos em um dia'),
('ach_marathon_player', 'da', 'Maratonspiller', 'Spil 50 spil på én dag'),
('ach_marathon_player', 'nl', 'Marathonspeler', 'Speel 50 spellen op één dag'),
('ach_marathon_player', 'sv', 'Maratonspelare', 'Spela 50 spel på en dag'),
('ach_marathon_player', 'fi', 'Maratonipelaaja', 'Pelaa 50 peliä yhdessä päivässä'),
('ach_marathon_player', 'cn', '马拉松玩家', '一天内玩50场游戏'),
('ach_marathon_player', 'ru', 'Марафонец', 'Сыграйте 50 игр за один день'),
('ach_marathon_player', 'jp', 'マラソンプレイヤー', '1日で50ゲームをプレイする'),
('ach_marathon_player', 'uk', 'Марафонець', 'Зіграйте 50 ігор за один день');

-- Night Owl Achievement Translations
INSERT OR IGNORE INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_night_owl', 'de', 'Nachteule', 'Spiele zwischen 23:00 und 05:00 Uhr'),
('ach_night_owl', 'en', 'Night Owl', 'Play between 11 PM and 5 AM'),
('ach_night_owl', 'es', 'Búho Nocturno', 'Juega entre las 11 PM y las 5 AM'),
('ach_night_owl', 'fr', 'Oiseau de Nuit', 'Joue entre 23h et 5h'),
('ach_night_owl', 'it', 'Gufo Notturno', 'Gioca tra le 23:00 e le 5:00'),
('ach_night_owl', 'pt', 'Coruja Noturna', 'Jogue entre 23h e 5h'),
('ach_night_owl', 'da', 'Natugle', 'Spil mellem 23:00 og 05:00'),
('ach_night_owl', 'nl', 'Nachtuil', 'Speel tussen 23:00 en 05:00'),
('ach_night_owl', 'sv', 'Nattuggla', 'Spela mellan 23:00 och 05:00'),
('ach_night_owl', 'fi', 'Yöpöllö', 'Pelaa klo 23:00 ja 05:00 välillä'),
('ach_night_owl', 'cn', '夜猫子', '在晚上11点到凌晨5点之间游戏'),
('ach_night_owl', 'ru', 'Полуночник', 'Играйте с 23:00 до 5:00'),
('ach_night_owl', 'jp', '夜更かし', '午後11時から午前5時の間にプレイする'),
('ach_night_owl', 'uk', 'Нічна сова', 'Грайте з 23:00 до 5:00');

-- Early Bird Achievement Translations
INSERT OR IGNORE INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_early_bird', 'de', 'Frühaufsteher', 'Spiele zwischen 05:00 und 09:00 Uhr'),
('ach_early_bird', 'en', 'Early Bird', 'Play between 5 AM and 9 AM'),
('ach_early_bird', 'es', 'Madrugador', 'Juega entre las 5 AM y las 9 AM'),
('ach_early_bird', 'fr', 'Lève-tôt', 'Joue entre 5h et 9h'),
('ach_early_bird', 'it', 'Mattiniero', 'Gioca tra le 5:00 e le 9:00'),
('ach_early_bird', 'pt', 'Madrugador', 'Jogue entre 5h e 9h'),
('ach_early_bird', 'da', 'Tidlig Fugl', 'Spil mellem 05:00 og 09:00'),
('ach_early_bird', 'nl', 'Vroege Vogel', 'Speel tussen 05:00 en 09:00'),
('ach_early_bird', 'sv', 'Tidig Fågel', 'Spela mellan 05:00 och 09:00'),
('ach_early_bird', 'fi', 'Aikainen Lintu', 'Pelaa klo 5:00 ja 9:00 välillä'),
('ach_early_bird', 'cn', '早起鸟', '在早上5点到9点之间游戏'),
('ach_early_bird', 'ru', 'Ранняя пташка', 'Играйте с 5:00 до 9:00'),
('ach_early_bird', 'jp', '早起き鳥', '午前5時から午前9時の間にプレイする'),
('ach_early_bird', 'uk', 'Рання пташка', 'Грайте з 5:00 до 9:00');

-- Weekend Warrior Achievement Translations
INSERT OR IGNORE INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_weekend_warrior', 'de', 'Wochenend-Krieger', 'Spiele sowohl am Samstag als auch am Sonntag'),
('ach_weekend_warrior', 'en', 'Weekend Warrior', 'Play on both Saturday and Sunday'),
('ach_weekend_warrior', 'es', 'Guerrero del Fin de Semana', 'Juega tanto el sábado como el domingo'),
('ach_weekend_warrior', 'fr', 'Guerrier du Week-end', 'Joue à la fois le samedi et le dimanche'),
('ach_weekend_warrior', 'it', 'Guerriero del Weekend', 'Gioca sia sabato che domenica'),
('ach_weekend_warrior', 'pt', 'Guerreiro do Fim de Semana', 'Jogue tanto no sábado quanto no domingo'),
('ach_weekend_warrior', 'da', 'Weekend Kriger', 'Spil både lørdag og søndag'),
('ach_weekend_warrior', 'nl', 'Weekend Strijder', 'Speel zowel op zaterdag als zondag'),
('ach_weekend_warrior', 'sv', 'Helgkrigare', 'Spela både lördag och söndag'),
('ach_weekend_warrior', 'fi', 'Viikonloppusotilas', 'Pelaa sekä lauantaina että sunnuntaina'),
('ach_weekend_warrior', 'cn', '周末战士', '在周六和周日都游戏'),
('ach_weekend_warrior', 'ru', 'Воин выходных', 'Играйте как в субботу, так и в воскресенье'),
('ach_weekend_warrior', 'jp', 'ウィークエンドウォリアー', '土曜日と日曜日の両方でプレイする'),
('ach_weekend_warrior', 'uk', 'Воїн вихідних', 'Грайте як у суботу, так і в неділю');

-- =============================================
-- Difficulty Master Achievement Translations
-- =============================================

-- Hard Difficulty Master Achievement Translations
INSERT OR IGNORE INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_hard_master', 'de', 'Schwierigkeits-Meister', 'Erreiche 10 perfekte Spiele im schweren Modus'),
('ach_hard_master', 'en', 'Hard Difficulty Master', 'Achieve 10 perfect games on hard difficulty'),
('ach_hard_master', 'es', 'Maestro de Dificultad Difícil', 'Logra 10 juegos perfectos en dificultad difícil'),
('ach_hard_master', 'fr', 'Maître de la Difficulté Difficile', 'Réalise 10 jeux parfaits en difficulté difficile'),
('ach_hard_master', 'it', 'Maestro Difficoltà Difficile', 'Ottieni 10 partite perfette in difficoltà difficile'),
('ach_hard_master', 'pt', 'Mestre da Dificuldade Difícil', 'Alcance 10 jogos perfeitos na dificuldade difícil'),
('ach_hard_master', 'da', 'Svær Sværhedsgrad Mester', 'Opnå 10 perfekte spil på svær sværhedsgrad'),
('ach_hard_master', 'nl', 'Moeilijkheidsgraad Meester', 'Behaal 10 perfecte spellen op moeilijke moeilijkheidsgraad'),
('ach_hard_master', 'sv', 'Svår Svårighetsgrad Mästare', 'Uppnå 10 perfekta spel på svår svårighetsgrad'),
('ach_hard_master', 'fi', 'Vaikean Tason Mestari', 'Saavuta 10 täydellistä peliä vaikealla tasolla'),
('ach_hard_master', 'cn', '困难难度大师', '在困难难度下达成10场完美游戏'),
('ach_hard_master', 'ru', 'Мастер сложности', 'Достигните 10 идеальных игр на сложном уровне'),
('ach_hard_master', 'jp', 'ハード難易度マスター', 'ハード難易度で10回の完璧なゲームを達成する'),
('ach_hard_master', 'uk', 'Майстер складності', 'Досягніть 10 ідеальних ігор на складному рівні');

-- Precision Player Achievement Translations
INSERT OR IGNORE INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_precision_player', 'de', 'Präzisions-Spieler', 'Erreiche 5 perfekte Spiele im schweren Modus ohne Joker'),
('ach_precision_player', 'en', 'Precision Player', 'Achieve 5 perfect games on hard difficulty without jokers'),
('ach_precision_player', 'es', 'Jugador de Precisión', 'Logra 5 juegos perfectos en dificultad difícil sin comodines'),
('ach_precision_player', 'fr', 'Joueur de Précision', 'Réalise 5 jeux parfaits en difficulté difficile sans jokers'),
('ach_precision_player', 'it', 'Giocatore di Precisione', 'Ottieni 5 partite perfette in difficoltà difficile senza jolly'),
('ach_precision_player', 'pt', 'Jogador de Precisão', 'Alcance 5 jogos perfeitos na dificuldade difícil sem coringas'),
('ach_precision_player', 'da', 'Præcisionsspiller', 'Opnå 5 perfekte spil på svær sværhedsgrad uden jokere'),
('ach_precision_player', 'nl', 'Precisiespeler', 'Behaal 5 perfecte spellen op moeilijke moeilijkheidsgraad zonder jokers'),
('ach_precision_player', 'sv', 'Precisionsspelare', 'Uppnå 5 perfekta spel på svår svårighetsgrad utan jokrar'),
('ach_precision_player', 'fi', 'Tarkkuuspelaaja', 'Saavuta 5 täydellistä peliä vaikealla tasolla ilman jokereita'),
('ach_precision_player', 'cn', '精准玩家', '在困难难度下不使用王牌达成5场完美游戏'),
('ach_precision_player', 'ru', 'Точный игрок', 'Достигните 5 идеальных игр на сложном уровне без джокеров'),
('ach_precision_player', 'jp', '精密プレイヤー', 'ジョーカーなしでハード難易度で5回の完璧なゲームを達成する'),
('ach_precision_player', 'uk', 'Точний гравець', 'Досягніть 5 ідеальних ігор на складному рівні без джокерів');

-- =============================================
-- Joker Master Achievement Translations
-- =============================================

-- Comeback King Achievement Translations
INSERT OR IGNORE INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_comeback_king', 'de', 'Comeback-König', 'Gewinne 5 Spiele nachdem du alle Joker verwendet hast'),
('ach_comeback_king', 'en', 'Comeback King', 'Win 5 games after using all jokers'),
('ach_comeback_king', 'es', 'Rey del Regreso', 'Gana 5 juegos después de usar todos los comodines'),
('ach_comeback_king', 'fr', 'Roi du Retour', 'Gagne 5 jeux après avoir utilisé tous les jokers'),
('ach_comeback_king', 'it', 'Re del Ritorno', 'Vinci 5 partite dopo aver usato tutti i jolly'),
('ach_comeback_king', 'pt', 'Rei do Retorno', 'Vença 5 jogos após usar todos os coringas'),
('ach_comeback_king', 'da', 'Comeback Konge', 'Vind 5 spil efter at have brugt alle jokere'),
('ach_comeback_king', 'nl', 'Comeback Koning', 'Win 5 spellen na het gebruiken van alle jokers'),
('ach_comeback_king', 'sv', 'Comeback Kung', 'Vinn 5 spel efter att ha använt alla jokrar'),
('ach_comeback_king', 'fi', 'Paluu Kuningas', 'Voita 5 peliä käytettyäsi kaikki jokerit'),
('ach_comeback_king', 'cn', '逆转之王', '在使用所有王牌后赢得5场游戏'),
('ach_comeback_king', 'ru', 'Король возвращения', 'Выиграйте 5 игр после использования всех джокеров'),
('ach_comeback_king', 'jp', 'カムバックキング', 'すべてのジョーカーを使った後に5ゲームに勝利する'),
('ach_comeback_king', 'uk', 'Король повернення', 'Виграйте 5 ігор після використання всіх джокерів');

-- No Joker Master Achievement Translations
INSERT OR IGNORE INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_no_joker_master', 'de', 'Joker-Verweigerer', 'Gewinne 10 Spiele ohne einen einzigen Joker zu verwenden'),
('ach_no_joker_master', 'en', 'No Joker Master', 'Win 10 games without using any jokers'),
('ach_no_joker_master', 'es', 'Maestro Sin Comodines', 'Gana 10 juegos sin usar ningún comodín'),
('ach_no_joker_master', 'fr', 'Maître Sans Joker', 'Gagne 10 jeux sans utiliser de jokers'),
('ach_no_joker_master', 'it', 'Maestro Senza Jolly', 'Vinci 10 partite senza usare jolly'),
('ach_no_joker_master', 'pt', 'Mestre Sem Coringa', 'Vença 10 jogos sem usar coringas'),
('ach_no_joker_master', 'da', 'Ingen Joker Mester', 'Vind 10 spil uden at bruge jokere'),
('ach_no_joker_master', 'nl', 'Geen Joker Meester', 'Win 10 spellen zonder jokers te gebruiken'),
('ach_no_joker_master', 'sv', 'Ingen Joker Mästare', 'Vinn 10 spel utan att använda jokrar'),
('ach_no_joker_master', 'fi', 'Ei Jokeri Mestari', 'Voita 10 peliä käyttämättä jokereita'),
('ach_no_joker_master', 'cn', '无王牌大师', '不使用任何王牌赢得10场游戏'),
('ach_no_joker_master', 'ru', 'Мастер без джокеров', 'Выиграйте 10 игр без использования джокеров'),
('ach_no_joker_master', 'jp', 'ノージョーカーマスター', 'ジョーカーを使わずに10ゲームに勝利する'),
('ach_no_joker_master', 'uk', 'Майстер без джокерів', 'Виграйте 10 ігор без використання джокерів');

-- =============================================
-- Combo Achievement Translations
-- =============================================

-- Perfect Storm Achievement Translations
INSERT OR IGNORE INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_perfect_storm', 'de', 'Perfekter Sturm', 'Perfektes Spiel + alle Antworten unter 5 Sekunden + schwerer Modus'),
('ach_perfect_storm', 'en', 'Perfect Storm', 'Perfect game + all answers under 5 seconds + hard difficulty'),
('ach_perfect_storm', 'es', 'Tormenta Perfecta', 'Juego perfecto + todas las respuestas bajo 5 segundos + dificultad difícil'),
('ach_perfect_storm', 'fr', 'Tempête Parfaite', 'Jeu parfait + toutes les réponses sous 5 secondes + difficulté difficile'),
('ach_perfect_storm', 'it', 'Tempesta Perfetta', 'Partita perfetta + tutte le risposte sotto 5 secondi + difficoltà difficile'),
('ach_perfect_storm', 'pt', 'Tempestade Perfeita', 'Jogo perfeito + todas as respostas abaixo de 5 segundos + dificuldade difícil'),
('ach_perfect_storm', 'da', 'Perfekt Storm', 'Perfekt spil + alle svar under 5 sekunder + svær sværhedsgrad'),
('ach_perfect_storm', 'nl', 'Perfecte Storm', 'Perfect spel + alle antwoorden onder 5 seconden + moeilijke moeilijkheidsgraad'),
('ach_perfect_storm', 'sv', 'Perfekt Storm', 'Perfekt spel + alla svar under 5 sekunder + svår svårighetsgrad'),
('ach_perfect_storm', 'fi', 'Täydellinen Myrsky', 'Täydellinen peli + kaikki vastaukset alle 5 sekunnissa + vaikea taso'),
('ach_perfect_storm', 'cn', '完美风暴', '完美游戏 + 所有答案少于5秒 + 困难难度'),
('ach_perfect_storm', 'ru', 'Идеальный шторм', 'Идеальная игра + все ответы менее 5 секунд + сложный уровень'),
('ach_perfect_storm', 'jp', 'パーフェクトストーム', '完璧なゲーム + すべての回答5秒未満 + ハード難易度'),
('ach_perfect_storm', 'uk', 'Ідеальний шторм', 'Ідеальна гра + всі відповіді менше 5 секунд + складний рівень');

-- Triple Threat Achievement Translations
INSERT OR IGNORE INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_triple_threat', 'de', 'Dreifach-Bedrohung', 'Perfekte Spiele in 3 verschiedenen Genres an einem Tag'),
('ach_triple_threat', 'en', 'Triple Threat', 'Perfect games in 3 different genres in one day'),
('ach_triple_threat', 'es', 'Triple Amenaza', 'Juegos perfectos en 3 géneros diferentes en un día'),
('ach_triple_threat', 'fr', 'Triple Menace', 'Jeux parfaits dans 3 genres différents en une journée'),
('ach_triple_threat', 'it', 'Tripla Minaccia', 'Partite perfette in 3 generi diversi in un giorno'),
('ach_triple_threat', 'pt', 'Tripla Ameaça', 'Jogos perfeitos em 3 gêneros diferentes em um dia'),
('ach_triple_threat', 'da', 'Tredobbelt Trussel', 'Perfekte spil i 3 forskellige genrer på én dag'),
('ach_triple_threat', 'nl', 'Driedubbele Bedreiging', 'Perfecte spellen in 3 verschillende genres op één dag'),
('ach_triple_threat', 'sv', 'Trippelhot', 'Perfekta spel i 3 olika genrer på en dag'),
('ach_triple_threat', 'fi', 'Kolmoisuhka', 'Täydelliset pelit 3 eri genressä yhdessä päivässä'),
('ach_triple_threat', 'cn', '三重威胁', '一天内在3个不同类型中达成完美游戏'),
('ach_triple_threat', 'ru', 'Тройная угроза', 'Идеальные игры в 3 разных жанрах за один день'),
('ach_triple_threat', 'jp', 'トリプルスレット', '1日で3つの異なるジャンルで完璧なゲーム'),
('ach_triple_threat', 'uk', 'Потрійна загроза', 'Ідеальні ігри в 3 різних жанрах за один день');