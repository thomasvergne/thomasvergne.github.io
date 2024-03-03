+++
title = 'La syntaxe de Haskell'
date = 2024-02-23T09:28:31+01:00
description = "Lire et déchiffrer la syntaxe cryptique de Haskell"
draft = false
author = "Sisypheus"
+++

Comme dit dans l'article précédent, Haskell est un langage original qui sait se démarquer par sa syntaxe souvent sujet à des plaisanteries. Effectivement, elle peut paraître aux premiers abords relativement cryptique et difficile à lire. Cependant, ce n'est qu'une question d'habitude ainsi que de prendre son temps pour comprendre ce que chaque élément du code signifie.

# Les bases

L'un des points notables de la syntaxe de Haskell est qu'il est quasiment entièrement constitué d'expressions. En effet, même la déclaration d'une variable est une expression.

## Les commentaires

Les commentaires en Haskell sont similaires à ceux de C++ ou de Java. Il y a deux types de commentaires : les commentaires sur une seule ligne et les commentaires sur plusieurs lignes.

```haskell
-- Ceci est un commentaire sur une seule ligne

{-
Ceci est un commentaire
sur plusieurs lignes
-}
```

## La déclaration de variable

La déclaration de variable en Haskell est très simple, bien que cela dépende de la portée de la variable. De ce fait, une variable globale peut se définir de la façon suivante :

```haskell
x = 5
```

On peut d'ailleurs aussi spécifier son type pour améliorer la clarté du code :

```haskell
x :: Int
x = 5
```

Pour une variable locale, on utilise le mot-clé `let` :

```haskell
main = do
    let x = 5
    print x
```

On peut bien évidemment transformer ce let en une expression dite let-in :

```haskell
main = let x = 5 in print x
```
