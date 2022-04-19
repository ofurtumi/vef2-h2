# Virkni

Hægt er að útfæra á móti þeirri lausn sem hópur vann í hópverkefni 1, eða nýta [sýnilausn](https://vef2-2022-h1-synilausn.herokuapp.com/) á [hópverkefni 1](https://github.com/vefforritun/vef2-2022-h1-synilausn).

## Valmynd/haus

Valmynd í haus hefur tengla á:

- [x] Forsíðu með titli vefs, t.d. `Vefforritunar veitingastaðurinn`
- [x] Tengill á matseðil
- [x] Karfa með fjölda vara sem eru í körfu, er tengill á körfusíðu

## Fótur

- [x] Í fæti er tengill á innskráningu fyrir starfsmenn í „bakvinnslu“.

## Forsíða

- [ ] Forsíða hefur „statísk“ gögn með dummy content og mynd, setjið inn eigið með t.d. `lorem ipsum` texti og myndum frá [Unsplash](unsplash.com/)
- *vantar mynd annars tæknilega komið*

## Matseðill

- [x] Birta skal allar vörur með síðuflettingu sjálfgefið. Þ.e.a.s. fyrir neðan vörur er hægt að ýta á takka/tengil til að skoða næstu síðu af vörum þar til búið er að skoða allar síður.
> tæknilega séð komið, beilaði á síðuflettingu því það er barn síns tíma og ég er kominn með nóg af því

- [x] Fyrir hverja vöru er mynd, titill og verð birt. Einnig er hægt að bæta vöru í körfu eða smella á titil/mynd til að sjá nánari upplýsingar um vöru.

- [ ] Fyrir ofan, eða til hliðar, skal birta flokka. Þegar smellt er á flokk skal birta aðeins þær vörur sem eru í þeim flokk.

- [ ] Fyrir ofan, eða til hliðar skal birta leitarglugga sem leitar í matseðli. Ef leit er virk og smellt er á flokk skal leita innan þess flokks.

- [x] Ef smellt er á vöru er birt síða fyrir vöruna með lýsingu á henni ásamt öllum gögnum um vöru. Einnig tengill til að fara til baka í matseðil eða bæta í körfu.

## Karfa

- [x] Fyrir hverja vöru er hægt að setja vöru í körfu, þá er birt einhver tilkynning um að vara sé komin í körfu.

- [x] Á körfu síðu eru allar vörur í körfu birtar ásamt titli, mynd, verði, fjölda í körfu og samtals fyrir línu. Fyrir neðan allar línur eru birt summa verðs.
> vantar að hafa myndir, verð og heildarverð *ætti ekki að vera mjög flókið, gögnin eru öll til staðar*

- [x] Aðgerð er til staðar á körfusíðunni sem breytir körfu yfir í pöntun þar sem fylla þarf inn nafn. Eftir að aðgerð er framkvæmd er farið yfir á pöntunarsíðu.
> vantar að bæta við nafni, rn er bara test gildi

## Pöntun

- [ ] Þegar pöntun er orðin til er staðfesting birt notanda. Opnuð er WebSocket tenging við bakenda sem tekur við uppfærslum á stöðu pöntunar. Birt er einhversskonar tilkynning um að beðið sé eftir uppfærslum.

- [ ] Ef WebSocket tenging lokast er reynt að opna hana aftur.

## Notendaumsjón

- [ ] Þegar farið er á bakvinnslusíðu er login gluggi, eftir login sem virkaði er token og upplýsingar um notanda vistað og notandi sendur á bakvinnslu síðu. Upplýsingar skal vista í localStorage. Möguleiki skal vera á að skrá sig út sem eyðir gögnum úr localStorage.
> vantar logout síðu

Ekki þarf að útfæra viðmót ofan á aðgerðir fyrir notendur:

* `GET` `/users`
* `GET` eða `PATCH` á `/users/:id`

## Bakvinnsla

Ef notandi er innskráður sem stjórnandi er hægt að:

- [ ] Búa til, eyða, breyta flokk
- [ ] Búa til, eyða, breyta vöru á matseðli
- [ ] Skoða lista af pöntunum og velja pöntun
- [ ] Fyrir opna pöntun, breyta stöðu ef staða er ekki komin í lokastöðu
- [ ] Fara á síðu sem birtir pantanir sem koma inn með því að tengjast WebSocket, þegar pöntun kemur inn skal vera hægt að opna hana til að breyta stöðu hennar

Stöður pöntunar eru:

* `NEW`, pöntun er komin inn en ekkert hefur verið gert
* `PREPARE`, pöntun er móttekin af starfsmönnum/eldhúsi og er í undirbúningi
* `COOKING`, verið er að elda það sem er í pöntun
* `READY`, pöntun er tilbúin til afhendingar til viðskiptvinar
* `FINISHED`, pöntun hefur verið afhend viðskiptavin

# Útlit

- [x] Setja skal upp einfalt, skalanlegt útlit fyrir vefinn. Mælst er til að nota grid og flexbox.

# Next.js og almenn virkni

- [x] Setja skal verkefnið upp með Next.js og TypeScript. Setja skal upp með _server-side rendering_.

- [ ] Þegar kallað er í vefþjónustu skal birta loading state og bregðast við villum. Þar sem gögn geta verið tóm skal huga að empty state.

- [ ] Ef síða finnst ekki skal birta 404 síðu.
> þarf að bæta við custom

- [ ] Ef reynt er að skoða síðu sem ekki er heimild til að skoða skal birta að ekki sé heimild til að skoða.

# Tæki og tól

- [ ] Setja skal upp eslint fyrir JavaScript. Engar villur skulu koma fram ef npm run lint er keyrt. Leyfilegt er að skilgreina hvaða reglusett er notað, ekki er krafa um að nota það sem hefur verið notað í öðrum verkefnum.

- [ ] Skrifa skal a.m.k. fjögur test með [Cypress](https://www.cypress.io/). Í `README` skal tiltaka hvernig test eru keyrð.