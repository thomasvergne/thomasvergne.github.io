+++
title = "Types et valeurs"
date = 2024-02-22T12:33:30+01:00
author = "Thomas Vergne"
description = "Comprendre et appréhender les types et les valeurs en Haskell"
tags = ["haskell", "functional programming"]
+++

Haskell est un langage que l'on pourrait qualifier d'original. En effet, il diffère bien des autres langages traditionnels en de nombreux points. Premièrement, il est un langage fonctionnel pur. Pour faire simple, c'est un langage de programmation qui se rapproche de certains concepts purement mathématiques.

Ensuite, il a quelques petites particularités telles que l'immuabilité (l'impossibilité de modifier la valeur d'une variable), les typeclasses, mais surtout son système de type très strict.

# Les valeurs

Les valeurs en Haskell sont, comme dans tous les autres langages, les composants de base de tout programme. Et bien heureusement, Haskell ne déroge pas à cette règle. On y retrouve les valeurs de base suivantes :

- Les entiers (positifs ou négatifs) : `1`, `-1`, `42`, `-42`, etc.
- Les nombres à virgule flottante : `1.0`, `-1.0`, `42.0`, `-42.0`, etc.
- Les booléens : `True`, `False`
- Les caractères : `'a'`, `'b'`, `'c'`, etc.
- Les chaînes de caractères : `"Hello, World!"`, `"Bonjour, monde!"`, etc.

Ces valeurs sont ce qu'on appelle dans les autres langages, les primitives. Néanmoins dans cette liste, plusieurs valeurs ne sont pas des primitives en Haskell à proprement parler : c'est le cas notamment des booléens et des chaînes de caractères.

Par exemple, on définit les booléens de la manière suivante :

```haskell
data Bool = True | False
```

Il faut interpréter dans ce cas le mot-clé `data` comme étant une sorte d'énumération. On définit donc un type `Bool` qui peut prendre deux valeurs : `True` ou `False`. On pourrait faire l'analogie en C avec :

```c
typedef enum {
    True,
    False
} bool;
```

Le mot clef `data` est donc utilisé pour définir des types de données. On peut également définir des types de données plus complexes, comme par exemple des listes, des arbres, des graphes, etc. C'est ce qu'on pourrait appeler des types de données algébriques, ou plus simplement des énumérations surchargées.

## Les valeurs plus complexes

Heureusement, on ne se limite pas à ces valeurs de base en Haskell. Grâce notamment aux types algébriques, il est possible de définir des valeurs plus complexes. Par exemple, on pourrait définir un type `Personne` de la manière suivante :

```haskell
data Personne = Personne {- prénom -} String {- âge -} Int
  deriving Show
```

Dans cet exemple, on définit un type `Personne` qui est composé de deux champs : un champ `prénom` de type `String` et un champ `âge` de type `Int`. On peut alors créer des valeurs de type `Personne` de la manière suivante :

```haskell
p1 = Personne "Thomas Vergne" 24
p2 = Personne "John" 42
```

Vous allez peut-être vous demander aussi à quoi peut bien servir le mot-clé `deriving Show`. Pour faire simple, il nous permet d'afficher les valeurs de type `Personne` de manière lisible, donc dans un `String`. Par exemple, si on exécute le code suivant :

```haskell
main = do
  print p1
  print p2
```

On obtiendra le résultat suivant :

```
Personne "Thomas Vergne" 24
Personne "John" 42
```

### Les fonctions

Les fonctions sont aussi une forme de valeur en Haskell, bien que ce ne soient pas des fonctions à proprement parler. On parlera plus de closures ou de fonctions anonymes. C'est une forme de primitive en Haskell, et on peut les définir de la manière suivante :

```haskell
add = \x y -> x + y
```

Dans cet exemple, on définit une fonction `add` qui prend deux arguments `x` et `y` et qui retourne la somme de ces deux arguments. On peut alors utiliser cette fonction de la manière suivante :

```haskell
main = do
  print $ add 1 2
```

Comme vous pouvez le voir, on utilise la fonction `add` de la même manière qu'une fonction classique, à la différence qu'on omet les parenthèses. C'est une des particularités de Haskell purement syntaxique mais qui est dûe à un principe qu'on appelle **curryfication**.

### La curryfication

La curryfication est un principe qui consiste à transformer une fonction prenant plusieurs arguments en une suite de fonctions prenant un seul argument. Par exemple, si on a une fonction `add` qui prend deux arguments `x` et `y`, on peut la transformer en une suite de fonctions `add'` de la manière suivante :

```haskell
add' = \x -> (\y -> x + y)
```

On peut ensuite appeler cette fonction de différentes manières :

```haskell
main = do
  print $ add' 1 2 -- 3
  print $ (add' 1) 2 -- 3
```

La deuxième façon d'appeler `add'` est une application partielle : on applique partiellement les arguments à la fonction `add'`. Un peu à la manière des closures dans les autres langages. Ce qui nous laisse la possibilité de définir des fonctions intéressantes facilement :

```haskell
addOne :: Int -> Int
addOne = add 1

main = do
  print $ addOne 2 -- 3
```

### Les listes et tuples

Les listes et les tuples sont des valeurs très utilisées en Haskell et de manière générale par leur capacité à encoder des données plus complexes. Une liste en Haskell n'est ni plus ni moins qu'une liste chaînée. Seulement, en Haskell les listes ne sont pas dites hétérogènes, c'est-à-dire qu'elles ne peuvent contenir que des valeurs de même type. Par exemple, on ne peut pas avoir une liste de la forme `[1, "Hello, World!", True]` en Haskell.

Les tuples, quant à eux, sont des valeurs qui peuvent contenir des valeurs de types différents. Par exemple, on peut avoir un tuple de la forme `(1, "Hello, World!", True)` en Haskell. Néanmoins, les tuples ne peuvent être modifiés de façon dynamique : là où on peut étendre une liste avec de nouvelles valeurs, on ne peut pas étendre un tuple à moins de le recréer.

# Les types

Les types en Haskell sont très importants. En effet, ils permettent de préciser le comportement et la caractéristique des valeurs. Reprenons l'exemple des litéraux de base (les valeurs primitives) :

- `1` **peut** être de type `Int` (on verra la subtilité plus tard)
- `1.0` **peut** être de type `Double`
- `True` est de type `Bool`
- `'a'` est de type `Char`
- `"Hello, World!"` est de type `[Char]` ou `String` (les deux sont équivalents)

On peut donc voir que les types sont très importants en Haskell. Ils permettent de préciser le comportement des valeurs. Par exemple, on ne peut pas additionner un `Int` avec un `Double` sans faire une conversion explicite. C'est ce qui fait de Haskell un langage fortement typé.

Pour un petit tour de syntaxe, on utilise l'opérateur `::` pour "assigner", spécifier un type à une valeur ou à une variable. Par exemple :

```haskell
1 :: Int
x :: Double
```

## Les fonctions

Les fonctions, tout comme toute valeur en Haskell, sont dotées d'un type. Par exemple, la fonction `add` que nous avons définie plus haut est de type `Int -> Int -> Int`. Cela signifie que `add` prend deux arguments de type `Int` et retourne un résultat de type `Int`. Il faut surtout le lire de cette manière : `add` prend un `Int` et retourne une fonction qui prend un `Int` et retourne un `Int`, soit `Int -> (Int -> Int)`.

On peut également définir des fonctions plus complexes, qui prennent plusieurs arguments et qui retournent des valeurs plus complexes. Par exemple, on pourrait définir une fonction `addPersonne` qui prend une `Personne` et un `Int` et qui retourne une `Personne` :

```haskell
addAge :: Personne -> Int -> Personne
addAge (Personne prenom age) annee = Personne prenom (age + annee)
```

On a utilisé ici une autre fonctionnalité du langage : le pattern matching. C'est une manière de déconstruire une valeur pour en extraire les composants. Dans cet exemple, on déconstruit la valeur `Personne prenom age` pour extraire le prénom et l'âge de la personne, ce qui nous permet de pouvoir ajouter `annee` à l'âge de l'individu.

## Les types génériques

Les types génériques permet comme leur nom l'indique de généraliser un type parametré. Par exemple, on pourrait définir une fonction `map` qui prend une fonction et une liste et qui applique la fonction à chaque élément de la liste :

```haskell
map :: (a -> b) -> [a] -> [b]
map _ [] = []
map f (x:xs) = f x : map f xs
```

On a utilisé dans ce code plusieurs notions qu'on a vu précédemment. On a utilisé le pattern matching pour déconstruire la liste, et on a utilisé une fonction anonyme `f` pour appliquer la fonction `f` à chaque élément de la liste. On peut voir cette fonction anonyme comme une sorte de callback en JavaScript. On a également utilisé un type générique `a` pour dire que la fonction `map` peut prendre une liste de n'importe quel type.

### Les types paramétrés

Un type paramétré est littéralement un type qui prend des paramètres. Par exemple, on pourrait définir un type `Liste` qui prend un type `a` et qui représente une liste de valeurs de type `a` :

```haskell
data Liste a = Vide | Noeud a (Liste a)
```

On a redéfinit là une liste chaînée. Pour utiliser ainsi cette liste, on appelle le type de la façon suivante : `nom_du_type paramètres_des_types`

```haskell
liste :: Liste Int
liste = Noeud 1 (Noeud 2 (Noeud 3 Vide))
```

#### Les types paramétrés génériques

On peut également définir des types paramétrés génériques. C'est notamment utile avec les typeclasses (on en parlera plus tard).

On a vu que le `a` de `Liste` pouvait être n'importe quel type. De cette même façon, on pourrait définir des signatures de fonction où `Liste` serait lui-même un type générique, afin de généraliser notamment le concept de mapping sur n'importe quelle structure :

```haskell
map :: (a -> b) -> f a -> f b
```

Ceci étant, vous pouvez tenter de chercher, mais il n'existe aucune implémentation possible et directe de cette fonction. Pourquoi ? Parce qu'on ne peut pas pattern match comme tout à l'heure puisqu'il ne s'agit pas d'une liste à proprement parler (on n'a pas `[a]` mais `f a`). C'est là qu'interviennent les typeclasses.

# Les typeclasses

Les typeclasses sont une notion très importante en Haskell, voir une notion centrale. Elles permettent de définir des comportements pour des types. C'est donc ce qui permet de décrire des comportements généraux. On pourrait par exemple concevoir une typeclasse `Affichable` qui permettrait de prendre une valeur quelconque et de la retourner formattée sous la forme d'une chaîne de caractère. On ferait donc :

```hs
class Affichable a where
  affiche :: a -> String
```

Maintenant que l'on a cette typeclasse, on peut définir et surtout concevoir des fonctions génériques bien plus puissantes. On pourrait par exemple définir une fonction `afficherTerminal` qui permet d'afficher n'importe quelle valeur dans le terminal :

```hs
putStrLn :: String -> IO ()
afficherTerminal :: Affichable a => a -> IO ()
afficherTerminal x = putStrLn (affiche x)
```

On a utilisé ici une autre notion importante en Haskell : les contraintes de type. On a dit que `afficherTerminal` ne peut prendre que des valeurs de type `a` qui sont des instances de la typeclasse `Affichable`. Mais pour l'instant, on n'a pas défini d'instance de `Affichable`. On pourrait par exemple définir une instance pour les entiers :

```hs
instance Affichable Int where
  affiche x = show x
```

Ou pour notre `Liste` :

```hs
instance Affichable a => Affichable (Liste a) where
  affiche Vide = "fin"
  affiche (Noeud x xs) = affiche x ++ " -> " ++ affiche xs
```

Ainsi, on peut désormais utiliser `afficherTerminal` avec n'importe quelle liste ou n'importe quel entier :

```hs
main = do
  afficherTerminal 1 -- 1
  afficherTerminal (Noeud 1 (Noeud 2 (Noeud 3 Vide))) -- 1 -> 2 -> 3 -> fin
```

## Les foncteurs

Pour reprendre notre exemple du `map` généralisé, il s'agit en réalité d'un foncteur (`Functor` en Haskell) à la fois au sens programmation qu'au sens mathématiques. Un foncteur est une structure qui permet de faire du mapping. On peut donc définir une typeclasse `Functor` qui permet de faire du mapping :

```hs
class Functor f where
  fmap :: (a -> b) -> f a -> f b
```

On peut ensuite définir des instances de `Functor` pour des types particuliers. Par exemple, on pourrait définir une instance pour notre `Liste` :

```hs
instance Functor Liste where
  fmap _ Vide = Vide
  fmap f (Noeud x xs) = Noeud (f x) (fmap f xs)
```

On peut ensuite utiliser `fmap` pour faire du mapping sur n'importe quelle liste :

```hs
main = do
  afficherTerminal (fmap (+1) (Noeud 1 (Noeud 2 (Noeud 3 Vide))))
  -- 2 -> 3 -> 4 -> fin
```

# Conclusion

Finalement, en partant de deux concepts liés qui peuvent paraître anodins, on a pu définir une grande partie du langage qu'est Haskell. On a pu voir à quel point le système de type de Haskell est le coeur même du langage et que c'est ce qui fait sa puissance dans le monde d'aujourd'hui.

Néanmoins, nous n'avons pas pu tout voir sur les types encore en Haskell et nous ne pourrons jamais tout voir : en effet le système de type de Haskell est vaste et régulièrement sujet à des ajouts.
