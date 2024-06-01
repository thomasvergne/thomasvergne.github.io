+++
title = 'Haskell - Comprendre pour mieux appréhender !'
date = 2024-03-03T17:38:41+01:00
draft = false
description = "Beaucoup d'implémentations d'algorithmes dans des compilateurs sont aujourd'hui écrites en Haskell. Malgré sa syntaxe parfois cryptique et effrayante, il est nécessaire de le comprendre pour mieux appréhender certains concepts théoriques de l'informatique"
author = "Thomas Vergne"
tags = ["haskell", "programmation fonctionnelle", "monades", "système de type"]

[cover]
image = "articles/get-started-with-haskell.png"
alt = "Un code Haskell"
caption = "Un code Haskell"
+++

Haskell est un langage de programmation assez atypique par rapport à la majorité des langages adoptés par les développeurs. Effectivement, on le remarque par sa syntaxe, ou par certaines de ses fonctionnalités qui peuvent paraître étranges. Cependant, comprendre le Haskell permet souvent à la fois de mieux comprendre certains concepts ou algorithmes de l'informatique théorique et permet aussi de préparer un bon terrain d'expérimentation et d'entraînement sur les compilateurs.

# Pourquoi apprendre Haskell ?

On pourrait se demander l'intérêt d'apprendre Haskell en pensant dans un premier temps qu'il s'agit d'un langage niche utilisé par personne. C'est en réalité à moitié vrai et faux : bien évidemment qu'il est moins utilisé qu'un langage comme Python ou Javascript, mais il reste tout de même relativement présent dans certains domaines de l'informatique. Tout comme son "confrère" OCaml, Haskell trouve souvent sa place dans les compilateurs, les logiciels d'industrie et les logiciels critiques.

Si on associe souvent Haskell aux compilateurs c'est par sa nature très adéquate pour l'implémentation de ces algorithmes. Il possède malgré tout une syntaxe qui fait son avantage : à défaut d'être vraiment lisible pour les non-initiés, elle a au moins le mérite d'être concise, de permettre d'écrire du code élégant et de pouvoir facilement représenter des objets et concepts mathématiques.

# Les bases de Haskell

## La philosophie du langage

Haskell est un langage qui se veut être fonctionnel pur le plus possible :

- Tout est expression et surtout **fonction**. Cela consiste à représenter les solutions à nos problèmes par des fonctions. Ça induit évidemment d'autres concepts indirectement, seulement il s'agit là de la base du paradigme fonctionnel.
- Les fonctions sont dites "pures". Cela signifie qu'elles n'ont pas d'effets de bord, c'est-à-dire qu'elles ne modifient pas l'état du programme. Mais cela signifie aussi qu'elles sont déterministes, c'est-à-dire qu'elles renvoient toujours la même valeur pour les mêmes arguments. C'est ce qui nous permet notamment de différencier les fonctions des procédures.

Pour démistifier encore plus la philosophie de Haskell, il est nécessaire d'éclaircir un point : Haskell est un langage paresseux. Comme son nom l'indique, cela signifie que les évaluations des expressions ne sont pas faites immédiatement, mais seulement lorsqu'elles sont nécessaires. Cela permet de ne pas évaluer des expressions qui ne seront pas utilisées, et donc d'éviter des calculs inutiles.

> Attention à ne pas confondre évaluation paresseuse et évaluation mémoïsée. L'évaluation paresseuse est une stratégie d'évaluation, tandis que l'évaluation mémoïsée est une technique d'optimisation.

Mis à part l'évaluation dite **lazy**, on retrouve d'autres concepts tels que l'immuabilité des données, la récursivité, les types algébriques, les types de données polymorphes, les types de données paramétrés, les types de données récursifs, les types de données abstraits, les classes de type, les monades, les foncteurs, les applicatifs, les flèches, etc. Ces concepts sont souvent abordés dans les cours d'informatique théorique, et c'est là où Haskell trouve son intérêt : il permet de mettre en pratique ces concepts.

## La syntaxe

Passons au point principal de discorde : la syntaxe. Pour mieux la comprendre, il faut surtout décomposer les éléments de base de la syntaxe :

- Les définitions de fonctions, d'opérateurs et de "variables"
- Les types de données
- Les typeclasses et les instances
- La programmation monadique
- Retour sur la syntaxe de Haskell
- Les monades en cas applicatif

Avec ces quatre points, on peut déjà comprendre une grande partie de la syntaxe de Haskell et réussir à déchiffrer une partie de la plupart des codes Haskell.

## Les définitions de fonctions, d'opérateurs et de "variables"

### Les définitions de fonctions

Les définitions de fonctions sont assez simples à comprendre. On définit une fonction en donnant son nom, ses arguments et son corps. Par exemple, la fonction qui calcule le carré d'un nombre s'écrit :

```haskell
square :: Int -> Int
square x = x * x
```

L'analogie avec un langage comme Python serait :

```python
def square(x: int) -> int:
    return x * x
```

On différencie donc le type de la fonction de son corps, comme on pourrait distinguer la spécification d'une fonction de son implémentation.

### Les définitions d'opérateurs

Les définitions d'opérateurs ne sont pas très différentes des définitions de fonctions. On définit un opérateur en donnant son nom, ses arguments et son corps. Par exemple, la fonction qui calcule la somme de deux entiers au carré s'écrit :

```haskell
(+^) :: Int -> Int -> Int
x +^ y = square x + square y
```

On doit parenthéser le nom de l'opérateur pour le définir. Mais lors de l'implémentation de l'opérateur, on peut choisir de passer en forme infixe ou en forme préfixe. Par exemple, on peut écrire `x +^ y = ...` ou `(+^) x y = ...`.

On doit aussi de la même manière faire attention à la priorité des opérateurs. Par exemple, si on définit un opérateur `(+^)` et un opérateur `(*^)`, on doit faire attention à ce que `(*^)` ait une priorité supérieure à `(+^)`. Comme on doit tenir compte de l'associativité des opérateurs.

### Les définitions de "variables"

Une variable en Haskell n'est ni plus ni moins qu'une fonction sans arguments. Ce qui peut paraître finalement logique de manière générale. Ce qui différencie principalement une variable d'une fonction c'est qu'on ne peut pas appeler la variable avec des arguments.

> Attention on considère toute variable qui retourne une lambda ou closure comme étant déjà une fonction. Effectivement, `f = \x -> \y -> x + y` équivaut à `f x y = x + y`.

Le fait qu'une variable soit considérée comme une fonction permet certaines choses intéressantes. On peut notamment définir des variables récursives :

```haskell
undefined :: a
undefined = undefined
```

Bon même si cet exemple ne reflète pas vraiment l'utilité puisqu'il s'agit d'une boucle infinie, permettant de faire crasher le programme. En revanche, cette fonctionnalité prend tout son sens lorsqu'il s'agit de manipuler des **parsers**.

## Les types de données

Avant de parler des types de données complexes en Haskell, il est important de déjà comprendre et découvrir certains types de données de base et surtout leur syntaxe.

### Les types de données dits "primitifs"

Ce qu'on appelle type de donnée primitif est un abus de langage, mais on entend par là les types de données de base, ceux qui ne peuvent pas être décomposés en d'autres types de données. On retrouve notamment :

- Les types de données numériques : `Int`, `Integer`, `Float`, `Double`
- Les types de données booléens : `Bool`
- Les types de données caractères : `Char`

### Les types de données composés

Les types de données composés peuvent être vus comme des types qui prennent en argument d'autres types. On parle aussi souvent de _Type Application_. On retrouve notamment :

- Les types de données listes : `[a]`
  - `a` est un type de donnée quelconque. On peut donc avoir des listes de `Int`, des listes de `Bool`, des listes de `Char`, etc.
- Les types de données tuples : `(a, b)`

### Les types de données algébriques

Les types de données algébriques sont une combinaison de deux types données sous-jacents. Ils sont en effet le mélange de sommes et de produits de types de données.

#### Les sommes de types

Les sommes de types sont ce qui s'apparente le plus à une énumération. Ainsi une somme de types est un type qui prend plusieurs formes étant des valeurs : on appelle ces formes des variants ou des constructeurs. Par exemple, le type de données `Bool` est une somme de types, car il peut prendre deux formes : `True` et `False`. On peut définir un type de données somme de types en Haskell de la manière suivante :

```haskell
data Bool = True | False
```

`Bool` est le nom du type qui sera utilisé dans les signatures et `True` et `False` sont les constructeurs du type `Bool`.

#### Les produits de types

Les produits de types peuvent être vus comme des "fonctions" qui prennent plusieurs arguments décris par des types directement. Pour prendre un exemple concret, le variant `Just` de `Maybe` prend en argument un type générique `a` et retourne un type `Maybe a`. On peut définir un type de données produit de types en Haskell de la manière suivante :

```haskell
data Maybe a = Nothing | Just a
```

`Maybe` est le nom du type qui sera utilisé dans les signatures et `Nothing` et `Just` sont les constructeurs du type `Maybe`. `Just` prend en argument un type générique `a` et retourne un type `Maybe a`. Ainsi, on pourrait définir `Maybe` différemment :

```haskell
data Maybe a
Just :: a -> Maybe a
Nothing :: Maybe a
```

### Les types de données récursifs

Les types de données récursifs sont comme les fonctions récursives, des types qui font référence à eux-mêmes dans leur définition. On peut par exemple définir une liste de manière récursive :

```haskell
data List a = Nil | Cons a (List a)
```

On appelle ça une liste chaînée. L'analogue en C pour `List Int` (les génériques n'existent pas en tant que structure native comme en Haskell) serait :

```c
struct List {
    int value;
    struct List *next;
};
```

### Les types de données polymorphes

On voit ces lettres en minuscule depuis le début de ce chapitre, mais on n'a pas encore vraiment expliqué ce qu'elles signifient. En Haskell, on peut utiliser ce qu'on appelle des types génériques. Ainsi le type `a` est un type qui lors de son utilisation peut prendre n'importe quelle forme. De cette façon, on peut concevoir une fonction `id` comme en mathématiques :

```haskell
id :: a -> a
id x = x
```

Où `a` est de manière équivalente l'ensemble $E$ dans la définition mathématique de la fonction identité $f : E \to E$.

## Les typeclasses et les instances

Les typeclasses sont un concept très important en Haskell. Elles permettent de définir des comportements pour des types de données. On peut voir ça comme une interface en Java ou en C#. C'est un peu l'analogue des traits en Rust. Les instances sont donc une implémentation de ces interfaces.

### Les typeclasses

Une typeclasse est donc une sorte d'interface qui définir des méthodes pour des types de données généralement génériques. On peut par exemple définir une typeclasse `Eq` qui définit une méthode `==` :

```haskell
class Eq a where
  (==) :: a -> a -> Bool
```

Cependant, on pourrait se questionner à propos de l'intérêt d'un tel mécanisme. En effet, on pourrait très bien définir une fonction `equals` qui prend deux arguments de type `a` et retourne un `Bool`. Ou encore définir une fonction spécialisée pour chaque type `a` dont on a besoin (par exemple avoir des fonctions `equalsInt`, `equalsBool`, `equalsString`). Néanmoins, ces deux techniques ont des défauts :

- La première implique de généraliser la notion d'égalité pour tous les types, ce qui n'est pas réellement possible compte tenu de la nature tant différente des types de données.
- La deuxième implique de définir une fonction pour chaque type, ce qui est fastidieux et peu pratique. Même si cela se fait en pratique, OCaml ne possède pas de telle fonctionnalité : on se retrouve donc souvent à écrire des fonctions `equals` pour chaque type de données.

Notons aussi que le type `a` dans cet exemple a lui-même un type qui permet de décrire sa forme, c'est ce qu'on appelle la _kind_, ou sorte en français. On dénote la sorte d'un type par `*`. De ce fait, `a` est implicitement de sorte `*` et `Maybe` est de sorte `* -> *`.

> Oui ! On a bel et bien défini une fonction qui opère et décrit des types. On Pourrait effectivement dire que `Maybe` est une fonction qui prend un type décrit par la sorte `*` (`a` en terme de type) et retourne un type décrit par la sorte `*` (`Maybe a` en terme de type).

#### Les superclasses

Une superclasse est une classe qui vient préciser les contraintes d'une autre classe. C'est un peu ce que sont les classes étendues en Java. On peut par exemple définir une superclasse `Eq` pour la classe `Ord` :

```haskell
class Eq a => Ord a where
  (<), (<=), (>), (>=) :: a -> a -> Bool
  compare :: a -> a -> Ordering
  max, min :: a -> a -> a
```

#### Utilisation des typeclasses

C'est bien intéressant de pouvoir définir des typeclasses, mais tout l'intérêt réside dans la capacité et possibilité à pouvoir définir des fonctions plus générales qui néanmoins sont capables de manipuler des types de données différents. On peut par exemple définir une fonction `isIn` qui prend un élément et une liste et retourne un `Bool` :

```haskell
isIn :: Eq a => a -> [a] -> Bool
isIn _ [] = False
isIn x (y:ys) = x == y || isIn x ys
```

On a donc défini ici un qualitificateur de type `Eq a` qui permet d'indiquer que la fonction peut utiliser les fonctions de la typeclass `Eq` sur le type `a`. On peut donc utiliser cette fonction avec n'importe quel type de données qui est une instance de `Eq`.

#### Bien d'autres fonctionnalités

Haskell permet encore bien d'autres opérations sur les typeclasses, qui sont souvent bien plus complexes. On notera ainsi les dépendances fonctionnelles (qui permettent de définir des contraintes sur les paramètres de la typeclass) et les types associés.

### Les instances

Les instances sont donc des implémentations des typeclasses. Puisqu'on vient de voir ce que sont les typeclasses, il est maintenant temps de voir comment on peut concrètement en faire usage.

Une instance est donc une implémentation d'une typeclasse pour un type de données donné. Cette instance doit respecter plusieurs critères :

- Le type de l'instance doit respecter la forme du type de la typeclasse. En d'autres termes, le code que l'on produit doit pouvoir typechecker. Plus techniquement, le type de l'instance doit respecter la sorte décrite ou induite par la typeclasse elle-même.
- Les méthodes de la typeclasse doivent être implémentées. C'est un peu le principe même de l'instance : on implémente les méthodes de la typeclasse pour le type de données donné.
- Si superclasse il y a, le type implémenté doit aussi implémenter la superclasse en question (par exemple pour implémenter `Ord Int`, il faut aussi implémenter `Eq Int`).

On peut par exemple implémenter la typeclasse `Eq` pour le type `Maybe` :

```haskell
instance (Eq a) => Eq (Maybe a) where
  Just x == Just y = x == y
  Nothing == Nothing = True
  _ == _ = False
```

Vous avez sûrement remarqué, mais on a utilisé une contrainte de type `Eq a` pour la méthode `==`. C'est tout à fait possible et c'est même très courant. Cela permet de dire que pour que `Maybe a` soit égal à `Maybe b`, il faut que `a` soit égal à `b`. C'est une sorte d'assertion sur le type `a`.

#### Les instances dérivées automatiques

Lorsqu'on commenceà produire beaucoup de code, on veut parfois s'épargner certaines instances de typeclasses qui sont évidentes. Par exemple, on pourrait vouloir de cette façon dire au compilateur que le type qu'on a créé est une instance de `Eq` sans devoir lui spécifier comment il doit comparer les éléments. C'est ce que permet Haskell avec les instances dérivées automatiques. On peut par exemple définir un type `Person` :

```haskell
data Person = Person { name :: String, age :: Int }
  deriving (Eq)
```

Ici, on a défini un type `Person` qui est une instance de `Eq`. Haskell va donc automatiquement générer une instance de `Eq` pour le type `Person` en utilisant les champs `name` et `age` pour comparer les éléments.

On peut faire de même avec d'autres instances de base généralement comme `Show` ou `Read`.

## La programmation monadique

On attaque à présent une, si ce n'est la, partie la plus dense de Haskell. La programmation monadique est un concept très important en Haskell, et c'est ce qui permet de gérer les effets de bord. C'est concept qui est très naturel à employer mais qui est souvent difficile à comprendre.

Cependant, pour comprendre la programmation monadique, il faut d'abord comprendre ce qu'est une monade et donc par extension revenir aux bases catégoriques de Haskell.

### Les foncteurs

Les foncteurs sont souvent la première étape pour comprendre les monades. Un foncteur est en Haskell une typeclasse qui définir une méthode de mapping généralisée. C'est un peu comme en théorie des catégories, où un foncteur est une application entre deux catégories qui vient "prendre" une catégorie initiale pour la "transformer" en une catégorie finale. Ainsi, on peut définir la typeclasse `Functor` :

```haskell
class Functor (f :: * -> *) where
  fmap :: (a -> b) -> f a -> f b
```

Si on substitue `f` par `[]` (une simple liste) et obtenir la signature suivante :

```haskell
fmap :: (a -> b) -> [a] -> [b]
```

Cette signature vous semble peut-être familière, et pour cause : c'est la signature de la fonction `map` ! En effet, `map` est une fonction qui prend une fonction `a -> b` et une liste `[a]` et retourne une liste `[b]`. On peut donc dire que `map` est une instance de la typeclasse `Functor` pour le type `[]`. Ainsi, vous commencez peut-être à comprendre l'intérêt des foncteurs en Haskell.

Une instance `Functor` pour le type `Maybe` pourrait ressembler à ceci :

```haskell
instance Functor Maybe where
  fmap f (Just x) = Just (f x)
  fmap f Nothing = Nothing
```

### La typeclasse `Applicative`

La typeclasse `Applicative` est une extension de la typeclasse `Functor`. Elle permet de définir des fonctions qui peuvent être appliquées à des foncteurs.

```haskell
class Functor f => Applicative (f :: * -> *) where
  pure :: a -> f a
  (<*>) :: f (a -> b) -> f a -> f b
```

La méthode `pure` permet d'encapsuler une valeur dans un type de donnée paramétré `f`. La méthode `<*>` permet d'appliquer une fonction encapsulée dans un type de donnée paramétré `f` à une valeur encapsulée dans un type de donnée paramétré `f`. Si cette fois ci au lieu de substituer `f` par `[]` on supprime carrément `f` (on utilise `Identity` en d'autres termes), on obtient la signature suivante :

```haskell
pure :: a -> a
(<*>) :: (a -> b) -> a -> b
```

Vous l'aurez peut-être à nouveau deviné, mais `pure` est la fonction `id` et `<*>` est la fonction d'application `$`. Ainsi, en omettant certains détails, on pourrait en conclure que `Applicative` est une généralisation de l'application de fonctions ainsi que de la fonction identité.

Une instance `Applicative` pour le type `Maybe` pourrait ressembler à ceci :

```haskell
instance Applicative Maybe where
  pure = Just
  -- ^ Ou aussi "pure x = Just x", qui permet d'encapsuler une valeur dans un Just et donc à partir d'une valeur quelconque de créer un Maybe.
  Just f <*> Just x = Just (f x)
  -- ^ Si on a une fonction qui existe ainsi qu'un paramètre qui existe, alors on peut appliquer la fonction "f x" et retourner le résultat dans un Just (pour dire que le résultat existe lui aussi)
  _ <*> _ = Nothing
  -- ^ Néanmoins, si l'un des deux n'existe pas, alors le résultat n'existe pas non plus. On retourne donc Nothing.
```

### Les monades

Les monades sont comme pour les applicatives, une extension des applicatives. Elles permettent de définir des fonctions qui peuvent être appliquées à des foncteurs. C'est la base de toute la programmation monadique en Haskell :

```haskell
class Applicative m => Monad (m :: * -> *) where
  (>>=) :: m a -> (a -> m b) -> m b
  return :: a -> m a
```

La méthode `return` est un peu comme `pure` pour les applicatives, elle permet d'encapsuler une valeur dans un type de donnée paramétré `m`. La méthode `(>>=)` est un peu plus compliquée à comprendre, mais elle permet grosso modo de faire du binding. On prend une valeur `m a`, on extrait la valeur de type `a` de la monade `m`, on effectue des calculs dessus, on retourne la nouvelle valeur de type `b` encapsulée dans la monade `m` et on finit par retourner le résultat de type `m b`. Il faut manipuler les instances et les applications concrètes pour mieux comprendre :

```haskell
instance Monad Maybe where
  return = Just
  Just x >>= f = f x
  Nothing >>= _ = Nothing
```

On peut l'utiliser comme ceci :

```haskell
main = print $ Just 6 >>= \x -> Just (x + 1) -- affiche "Just 7"
```

### Les monades en do-notation

La do-notation est une syntaxe spéciale en Haskell qui permet de manipuler des monades de manière plus lisible. Elle permet de faire des opérations de binding de manière plus naturelle, et donc d'introduire une sorte de programmation impérative en Haskell, presque quasiment séquentielle. Il y a donc certains éléments de syntaxe qui diffèrent et qui sont spécifiques à la do-notation :

- On utilise le mot-clé `do` pour introduire une séquence d'opérations de binding.
- On utilise le mot-clé `<-` pour effectuer un binding. On repère à gauche le nom de la variable bound et à droite l'opération monadique (donc une valeur de type `m a` pour `a` un type quelconque et `m` la monade du do-notation).
- On utilise le mot-clé `return` pour retourner une valeur de type `m a` (donc une valeur encapsulée dans une monade et simuler un return impératif). Néanmoins, il n'est pas possible via cette fonction d'effectuer des early-return (c'est-à-dire de retourner une valeur avant la fin de la fonction).
- On utilise le mot-clé `let` pour déclarer des variables locales sans devoir préciser la suite du let (via le `in ...` habituellement).

Voici donc un exemple de do-notation :

```haskell
test = do
  x <- Just 6
  return (x + 1)

main = print test -- affiche "Just 7"
```

## Retour sur la syntaxe de Haskell

Bon, il est à présent nécessaire de revenir sur quelques éléments de base de la syntaxe de Haskell, déjà pour toujours mieux comprendre le langage et ensuite pour pouvoir avoir un peu de répit avant la dernière partie de ce tutoriel !

Néanmoins, nous n'allons pas nous attarder sur les éléments et détails du langage qui sont finalement présents dans tous les langages modernes aujourd'hui, mais plutôt sur les éléments syntaxiques qui sont spécifiques à Haskell.

### Le pattern matching

Le pattern matching est une fonctionnalité très utilisée et très pratique en programmation de manière générale, ça permet de décomposer des structures de données afin d'en extraire des valeurs à la manière d'un destructuring en JavaScript ou d'un matching en Rust. En Haskell, ce pattern matching est présent plus qu'il ne l'est dans les deux autres langages :

```haskell
lucky :: Int -> String
lucky 7 = "Lucky number seven!"
lucky x = "Sorry, you're out of luck!"

lucky' :: Int -> String
lucky' x = case x of
  7 -> "Lucky number seven!"
  _ -> "Sorry, you're out of luck!"
  -- ^ Le "_" est un wildcard, il permet de matcher n'importe quelle valeur.

lucky'' :: Int -> String
lucky'' x
  | x == 7 = "Lucky number seven!"
  | otherwise = "Sorry, you're out of luck!"
  -- ^ Les "|" sont des guards, ils permettent de matcher des conditions.

main = do
  let liste = [1, 2, 3]
  case liste of
    [] -> print "La liste est vide."
    [x] -> print "La liste contient un seul élément."
    [x, y] -> print "La liste contient deux éléments."
    _ -> print "La liste contient plus de deux éléments."
```

### Les fonctions anonymes

Les fonctions anonymes sont des fonctions qui n'ont pas de nom, elles sont définies directement dans le code et sont souvent utilisées pour des fonctions d'ordre supérieur (HOF). En Haskell, elles sont définies à l'aide du symbole `\` :

> Une HOF (ou _Higher Order Function_) est une fonction qui prend une ou plusieurs fonctions en paramètre et/ou qui retourne une fonction.

```haskell
add :: Int -> (Int -> Int)
add = \x -> (\y -> x + y)

main = do
  let f = \x -> add x 1
  print (f 6) -- affiche "7"
```

Les fonctions par défaut sont closurées, c'est-à-dire qu'elles sont closes et peuvent capturer les variables extérieures à leur scope :

```haskell
add :: Int -> (Int -> Int)
add x = \y -> x + y

main = do
  let y = 3
  let f = \x -> add x y
  print (f 6) -- affiche "9"
```

### Les records

Les records sont une manière de définir des types de données avec des champs nommés. Ils sont très utilisés en Haskell pour définir des types de données complexes et structurés :

```haskell
data Person = Person
  { name :: String
  , age :: Int
  , email :: String
  }
```

On peut ensuite créer des valeurs de type `Person` :

```haskell
main = do
  let p = Person { name = "John", age = 25, email = "john@doe.com" }
  print p -- affiche "Person {name = "John", age = 25, email = "john@doe.com" }"
```

On peut de la même façon qu'avec les product-types, pattern match dessus de la façon suivante :

```haskell
printPerson :: Person -> IO ()
printPerson (Person { name = n, age = a, email = e }) = do
  putStrLn $ "Name: " ++ n
  putStrLn $ "Age: " ++ show a
  putStrLn $ "Email: " ++ e
```

### Les applications (ou calls) de fonctions

Haskell est un des rares langages à automatiquement curryfier les fonctions, c'est-à-dire à transformer les fonctions à plusieurs arguments en une suite de fonctions à un seul argument. Cela permet de pouvoir appliquer partiellement des fonctions, c'est-à-dire de ne pas fournir tous les arguments d'une fonction pour obtenir une nouvelle fonction qui attend les arguments restants. Cela permet entre autres de créer des fonctions plus modulables.

```haskell
add :: Int -> (Int -> Int)
add x y = x + y
-- <=>
add :: Int -> (Int -> Int)
add = \x -> (\y -> x + y)
-- <=>
add :: Int -> (Int -> Int)
add = \x y -> x + y
-- <=>
add :: Int -> (Int -> Int)
add x = \y -> x + y
```

Dans un langage comme Javascript qui n'est pas techniquement pensé pour fonctionner à 100% de manière curryfiée et partielle, on appelerrait la fonction `add` de la manière suivante :

```javascript
add(1)(2);
```

Seulement, suivant les fonctions, ça peut commencer à devenir embêtant et surtout lourd une telle syntaxe. C'est pour cela qu'on omet ces parenthèses en Haskell pour n'avoir que :

```haskell
(add 1 2) :: Int
```

Attention tout de même, on peut spécifier les parenthèses, c'est même obligatoire dans certains cas (sans compter les tuples bien évidemment qui sont un cas évident) :

```haskell
add (1 + 2) 3 :: Int
```

Ou même pour faire de l'application "partielle" directement totale ensuite :

```haskell
(add 1 :: Int -> Int) 2 :: Int
```

### Les fonctions d'un point de vue type

En Haskell, pour typer une fonction on utilise l'opérateur type-level `(->)` qui est utilisé de la façon suivante : `a -> b` où `a` est le type de l'argument de la fonction et `b` le type de retour. Reprenons l'exemple de la fonction `add` :

```haskell
add :: Int -> (Int -> Int)
```

La fonction `add` prend un entier en argument et retourne une fonction qui prend à nouveau un entier mais qui cette fois-ci retourne un entier également. On pourrait omettre les parenthèses pour avoir une syntaxe plus claire :

```haskell
add :: Int -> Int -> Int
```

Mais dans certains cas il est nécessaire d'avoir les parenthèses, c'est le cas de la fonction `map` :

```haskell
map :: (a -> b) -> [a] -> [b]
```

Sans les parenthèses, donc `map :: a -> b -> [a] -> [b]`, ce serait une fonction qui prendrait trois arguments, ce qui n'est pas le cas. La fonction `map` prend deux arguments, une fonction et une liste, et retourne une liste.

## Les monades en cas applicatif

On a vu précédemment que les monades sont des types de données qui permettent de chaîner des calculs de manière séquentielle. Néanmoins, on n'a pas encore réellement de cas pratique où avoir recours à une monade et encore moins à la do-notation est nécessaire. C'est là qu'interviennent certains concepts plus poussés de Haskell.

Jusqu'à présent, nous avons surtout conçu du code Haskell qui était immuable. On pourrait faire cela pour tous les programmes possibles et imaginables, mais ce n'est pas réellement pratique dans la réalité. En effet, avoir de la mutabilité ou du moins quelque chose qui s'en approche, pourrait se révéler très utile pour avoir des programmes plus élégants. C'est là qu'interviennent certains types de données dont `State`.

### Le type `State`

Le type `State` est un type de données qui permet de gérer de la mutabilité de façon à n'avoir aucun effet de bord. Parfait non ? On combine tous les avantages de la programmation fonctionnelle pure avec ceux de la programmation impérative mutable !

On peut définir le type `State` de la façon suivante :

```haskell
newtype State s a = State { runState :: s -> (a, s) }
```

Là, on peut dire qu'on tombe sur un code cryptique lorsqu'on est pas habitué à manipuler `State`. Mais n'ayons pas peur et décortiquons cela. `State` est un type de données qui prend deux paramètres, `s` et `a`. `s` est le type de l'état et `a` le type de la valeur que l'on veut retourner. `runState` est une fonction qui permet d'exécuter une action de changement d'état. Elle prend en argument un état initial et retourn un couple composé de la valeur retournée à l'issue de l'action exécutée ainsi que de l'état initial modifié.

> À noter que `State` est de type `(s -> (a, s)) -> State s a`.

On peut ensuite définir des fonctions pour manipuler des états :

```haskell
get :: State s s
get = State $ \s -> (s, s)
```

`get` permet littérallement de récupérer l'état actuel. On peut également définir une fonction pour changer l'état :

```haskell
put :: s -> State s ()
put s = State $ \_ -> ((), s)
```

`put` permet de changer l'état actuel, même plus fortement de l'écraser. On peut également définir une fonction pour modifier l'état en utilisant l'état actuel :

```haskell
modify :: (s -> s) -> State s ()
modify f = State $ \s -> ((), f s)
```

`modify` permet de modifier l'état actuel en utilisant une fonction `f` qui prend l'état actuel en argument et retourne le nouvel état.

Maintenant que l'on a nos fonctions pour manipuler des états, on peut les combiner pour créer des actions plus complexes, notamment en implémentant `Functor`, `Applicative` et `Monad` pour `State`.

#### `Functor`, `Applicative` et `Monad` pour `State`

On peut implémenter `Functor`, `Applicative` et `Monad` pour `State` de la façon suivante :

```haskell
instance Functor (State s) where
  fmap f (State g) = State $ \s ->
    let (a, s') = g s
      in (f a, s')
```

```haskell
instance Applicative (State s) where
  pure a = State $ \s -> (a, s)
  State f <*> State g = State $ \s ->
    let (h, s') = f s
        (a, s'') = g s'
      in (h a, s'')
```

```haskell
instance Monad (State s) where
  return = pure
  State f >>= g = State $ \s ->
    let (a, s') = f s
      in runState (g a) s'
```

Ce qu'il faut retenir sur ces implémentations par rapport à `State`, c'est que dans tous les cas, on recrée un nouvel état à chaque action. Ce nouvel état se base constamment sur le précédent. C'est comme cela qu'on simule la mutabilité. Maintenant qu'on a fait tout le travail pour `State`, on peut passer à des exemples concrets.

#### Exemple concret de `State`, la stack

On peut utiliser `State` pour implémenter une stack. On peut définir une stack de la façon suivante :

```haskell
type Stack = [Int]
```

On peut ensuite définir des fonctions pour manipuler la stack :

```haskell
pop :: State Stack Int
pop = State $ \(x:xs) -> (x, xs)

push :: Int -> State Stack ()
push x = State $ \xs -> ((), x:xs)
```

```haskell
stackManip :: State Stack ()
stackManip = do
  push 3
  x <- pop
  st <- get
  if length st == 0
    then return ()
    else do
      y <- pop
      push (x + y)

main = do
  print $ runState stackManip [5] --affiche "(8, [])"
```

Ici, on a une stack qui contient un seul élément, 5. On exécute `stackManip` qui ajoute 3 à la stack, retire 5, retire 3, ajoute 8 à la stack et finalement retire 8. On obtient donc une stack vide et la valeur 8.

### "Composer" des monades

On a vu précédemment que les monades permettent de chaîner des calculs de manière séquentielle. Néanmoins, on pourrait vite trouver des cas où on se retrouve limiter par ces monades. Ni plus ni moins que le cas où on effectue des actions monadiques sur un `Maybe` mais que l'on souhaiterait également effectuer des actions monadiques sur `IO` (par exemple pour afficher un résultat en cours de route).

Pour cela, on va devoir "composer" des monades. C'est-à-dire concevoir un nouveau type `Maybe` qui encapsule plus uniquement une valeur mais également une monade. On peut définir ce type de données de la façon suivante :

```haskell
newtype MaybeT m a = MaybeT { runMaybeT :: m (Maybe a) }
```

On désigne le T pour Transformer, effectivement, le principe de composition monadique est de permettre d'encapsuler d'autres monades dans des monades existantes, de "stacker" ces monades. Ici `MaybeT` est une monade qui encapsule une monade générique `m` qui encapsule une valeur de type `Maybe a`. On peut ensuite définir des fonctions pour manipuler `MaybeT` :

```haskell
instance Monad m => Monad (MaybeT m) where
  return = MaybeT . return . Just
  x >>= f = MaybeT $ do
    v <- runMaybeT x
    case v of
      Nothing -> return Nothing
      Just y -> runMaybeT (f y)
```

On peut également définir des fonctions pour manipuler `MaybeT` :

```haskell
lift :: Monad m => m a -> MaybeT m a
lift = MaybeT . (liftM Just)
```

On peut définir `liftM` de la façon suivante :

```haskell
liftM :: Monad m => (a -> b) -> m a -> m b
liftM f m = m >>= (return . f)
```

`liftM` permet de transformer une valeur de type `m a` en une valeur de type `m b` en appliquant une fonction `f` à la valeur de type `a` contenue dans `m a`. C'est le `fmap` monadique.

Maintenant que l'on a défini `MaybeT`, on peut l'utiliser pour composer des monades. Par exemple, on peut composer `MaybeT` avec `IO` :

```haskell
type IOMaybe = MaybeT IO

main = do
  result <- runMaybeT $ do
    liftIO $ putStrLn "Enter your name:"
    name <- liftIO getLine
    if name == "Simon"
      then return name
      else liftIO $ putStrLn "You are not Simon!"
  case result of
    Just name -> putStrLn $ "Hello, " ++ name ++ "!"
    Nothing -> return ()
```

La fonction `liftIO` est de type `MonadIO m => IO a -> m a`, elle permet d'effectuer une action `IO` dans un contexte monadique `m`. C'est ce qui nous donne le droit ici de pouvoir `getLine` ou `putStrLn` dans la monade `MaybeT`.

On peut faire cette macro-composition de monades avec n'importe quelle monade, pas seulement `IO`. On peut par exemple composer `MaybeT` avec `State`. Néanmoins, on doit implémenter `MonadTrans` pour les monades que l'on souhaite composer. Contrairement par exemple aux effets algébriques dans d'autres langages où la composition est induite et naturelle.

## Conclusion

Finalement, on aura vu au cours de ce tutoriel que les problèmes initiaux que l'on pourrait imaginer au sujet de Haskell sont solvables tout en restant dans la philosophie de Haskell. C'est ce qui fait sa force finale : pouvoir faire autant que les autres langages sans pour autant en perdre sur certains points.

En revanche, on a pu aussi voir que c'est un langage avec lequel il est important de se familiariser pour pouvoir être proefficace. Il est très dense et atypique, ce qui le rend aux premiers abords compliqués. Mais une fois que l'on a compris les concepts de base, on peut commencer à apprécier la puissance de ce langage.

Cet article n'était pas dans le but de vous faire une introduction au Haskell pour le pur plaisir de faire une introduction à un langage, mais surtout dans le but d'introduire la future série d'articles qui traîtera de création de langage de programmation et notamment d'écriture de compilateurs. Et Haskell est particulièrement un bon choix pour ce genre de tâches. C'est pour cela que l'on a vu des concepts de base de Haskell, mais aussi des concepts plus avancés pour pouvoir comprendre plus aisément les articles à venir.
