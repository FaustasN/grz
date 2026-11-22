# SEO raktažodžių analizė — Autovaldika

Būsena: **2 skyriaus sąrašas patvirtintas** (2026-11-22). 3 ir 4 skyrių klausimai (vietovės, paslaugos be puslapio,
darbo laikas) dar neatsakyti — kol atsakymo nėra, 3 etape naudojami tik Vaidotai / Vilnius ir 7 esamos paslaugos.

Svarbu: paieškų skaičių čia nėra — raktažodžių įrankio neturėjau. Prioritetas (A/B/C) yra mano vertinimas
pagal tai, kiek užklausa konkreti ir kiek joje konkurencijos. Tikri duomenys iš Google Search Console
arba Google verslo profilio būtų tikslesni už bet kokį spėjimą.

## 1. Pagrindinė logika

- Vienas puslapis — viena pagrindinė užklausa. Dabar beveik visi puslapiai kartoja
  „Automobilių servisas Vaidotuose“, todėl konkuruoja tarpusavyje.
- Užklausos formulė: **paslauga + vieta**. „Autoservisas Vilnius“ yra per plati (dideli servisai, katalogai
  paslaugos.lt, 1551.lt); realu laimėti „paslauga + Vaidotai / Pagiriai / pietinis Vilnius“.
- Paieškoje „autoservisas Vaidotai“ nė vienas rezultatas nemini Vaidotų — vietinė niša laisva.
- `keywords` meta žyma Google reitingui įtakos neturi. Patvirtinti raktažodžiai turi atsidurti
  title, H1, description ir puslapio tekste, o ne tik toje žymoje.

## 2. Raktažodžiai pagal puslapį

| Puslapis | Pagrindinė užklausa | Papildomos / variantai | Ką dengia dabar | Spraga | Prior. |
|---|---|---|---|---|---|
| `/` | autoservisas Vaidotuose | automobilių servisas Vaidotai; auto servisas Pagiriai; autoservisas pietinis Vilnius; Autovaldika | title ir H1 turi „Automobilių servisas Vaidotuose“ | nėra žodžio „autoservisas“ (rašomas kartu — dažnesnė forma); nėra Vilniaus / gretimų vietovių; rodomos tik 4 iš 7 paslaugų | A |
| `/paslaugos` | autoserviso paslaugos ir kainos | automobilių remontas Vaidotuose; automobilių remontas Vilnius; autoserviso kainos | title „Paslaugos \| …“, H1 „Visos autovaldika teikiamos paslaugos“ | H1 be vietos ir be žodžio „remontas“; kainų nėra visai | B |
| `/paslaugos/diagnostika` | kompiuterinė automobilio diagnostika Vaidotuose | variklio diagnostika; klaidų nuskaitymas ir trynimas; „check engine“ lemputė; diagnostika prieš perkant | H1 „Kompiuterinė diagnostika“ | description „Šiame puslapyje aprašoma…“ — neparduoda; H1 be vietos | A |
| `/paslaugos/tepalu-keitimas` | tepalų keitimas Vaidotuose | alyvos keitimas; variklio alyvos ir filtrų keitimas; tepalų keitimas kaina | H1 „Tepalų keitimas“; tekste Vaidotai | „alyvos keitimas“ tik keywords žymoje; nėra kainos | A |
| `/paslaugos/3d-ratu-suvedimas` | 3D ratų suvedimas Vilnius | ratų suvedimas Vaidotuose; ratų geometrija; ratų geometrijos reguliavimas; suvedimas kaina | H1 „3D ratų suvedimas“; tekste „Vaidotuose ir Vilniaus rajone“ | „ratų geometrija“ nėra H1/H2; description aprašomoji | A |
| `/paslaugos/vaziuokles-remontas` | važiuoklės remontas Vaidotuose | pakabos remontas; amortizatorių keitimas; šarnyrų, traukių, stabilizatoriaus traukių keitimas | H1 „Važiuoklės remontas“ | „pakabos remontas“ tik keywords žymoje | A |
| `/paslaugos/stabdziu-remontas` | stabdžių remontas Vaidotuose | stabdžių kaladėlių keitimas; stabdžių diskų keitimas; stabdžių skysčio keitimas | H1 „Stabdžių remontas“ | kaladėlės / diskai nėra antraštėse | A |
| `/paslaugos/kebulo-remontas` | meninis lyginimas Vilnius | įlenkimų lyginimas be dažymo; kėbulo remontas Vaidotuose; krušos pažeidimų lyginimas; PDR | H1 „Kėbulų remontas / Meninis lyginimas“ | du skirtingi ketinimai viename puslapyje; nėra „be dažymo“; URL ir title „kėbulo“, H1 „kėbulų“ | A |
| `/paslaugos/zibintu-remontas` | žibintų poliravimas Vilnius | žibintų reguliavimas; žibintų remontas Vaidotuose; žibintų atnaujinimas | H1 „Žibintų remontas“ | poliravimas (ieškomiausias variantas) tik keywords žymoje | B |
| `/galerija` | (firminė) Autovaldika darbai | automobilių remontas prieš ir po; meninio lyginimo pavyzdžiai | title „Darbų galerija“ | alt tekstai angliški („Before photo“); reitinguoti savarankiškai neverta | C |
| `/straipsniai` | — kol tuščia | vėliau: informacinės užklausos (žr. 5 skyrių) | sąrašas tuščias | tuščias puslapis indeksuojamas — siūlau `noindex`, kol nėra straipsnių | C |

Rašybos variantai, kuriuos verta natūraliai pavartoti tekste (ne grūsti į title):
autoservisas / auto servisas / automobilių servisas; tepalų / alyvos; ratų suvedimas / geometrija;
važiuoklė / pakaba; meninis lyginimas / įlenkimų lyginimas be dažymo. Formų be lietuviškų raidžių
(„ratu suvedimas“) atskirai taikyti nereikia — Google jas sutapatina.

## 3. Geografija — reikia jūsų atsakymo

Svetainėje visur „Vaidotuose“, bet adresas — „Jaunystės g. 11A, LT-02236 Vilnius“. VLE aprašo Vaidotus kaip
kaimą Vilniaus rajone, Pagirių seniūnijoje, ~1 km nuo Pagirių, šalia Baltosios Vokės — bet tai viena paieška,
nepatikrinta su žemėlapiu, o to paties pavadinimo vietovių gali būti ne viena. Tikslią vietą patvirtina savininkas.
Trakų Vokė jau Vilniaus miesto dalis (Panerių seniūnija).

Kandidatai vietovėms (**tik patvirtinus, kad iš ten tikrai atvažiuoja klientai**):
Vaidotai, Pagiriai, Baltoji Vokė, Trakų Vokė, Paneriai, „pietinis Vilnius“, Vilniaus rajonas.

## 4. Nepatvirtintos paslaugos (netaikomos, kol nepatvirtinsite)

Šios minimos dabartinėje `keywords` žymoje, bet puslapio joms nėra:
padangų keitimas / montavimas, ratų balansavimas, Webasto montavimas ir remontas,
starterio / generatoriaus remontas, automobilio elektronika, centrinio užrakto remontas,
paruošimas techninei apžiūrai, uždegimo žvakių keitimas.
Taip pat: „Avarijos rūpesčius palikite mums“ — ar atliekamas remontas po avarijos / darbas su draudimu?

Jei paslauga teikiama — verta atskiro puslapio (padangų montavimas ir remontas po avarijos būtų stiprūs).
Jei ne — iš žymų reikia išimti.

Atskirai: darbo laikas nurodytas „Pr–Sekm 09:00–19:00“. Jei tikrai dirbama savaitgaliais,
„autoservisas dirbantis savaitgaliais / sekmadienį“ yra retas ir vertingas išskirtinumas.

## 5. Straipsnių temos (vėlesniam laikui, neprivaloma)

Kada keisti tepalus; kaip suprasti, kad reikia ratų suvedimo; ką reiškia užsidegusi variklio lemputė;
meninis lyginimas ar dažymas — kada kuris; kaip pasiruošti techninei apžiūrai.

## 6. Techninės spragos 3 etapui (užfiksuota, netaisyta)

- `<html>` be `lang="lt"`.
- Nėra struktūrinių duomenų (JSON-LD `AutoRepair`: adresas, telefonas, darbo laikas) — vietinei paieškai svarbiausia.
- Nėra Open Graph, canonical; `/` neturi savo metadata.
- Silpni description („Šiame puslapyje aprašoma…“) — turi būti nauda + vieta + telefonas.
- `/straipsniai` tuščias, bet indeksuojamas, ir jo nėra sitemap.
- Likę svetimo šablono tekstai „TireService“ (`Header.tsx:15`, `ContactSection.tsx:91`).
- Galerijos alt tekstai angliški.
- Ne kodas, bet didžiausias svertas vietinei paieškai: Google verslo profilis (kategorija, paslaugos, nuotraukos, atsiliepimai).

## Šaltiniai

- https://www.vle.lt/straipsnis/vaidotai/
- https://en.wikipedia.org/wiki/Vaidotai
- https://www.vle.lt/straipsnis/traku-voke/
- https://paslaugos.lt/automobiliu-remontas/vilniuje
- https://paslaugos.lt/meninis-lyginimas/vilniuje
