# fish shell導入してみた
今までzshを使用してましたが、Qiitaなどでチラチラとfish shell関連の記事を見かけるようになったため、気になって導入してみました。

## 動作環境
macOS Mojave
(バージョン10.14.4)

## fishとは
90年代の方に向けた最後の（**fi**nally）コマンドラインシェル(**sh**ell）のようです。
名前の通り、公式サイトを覗くと魚（fish）がトレードマークになってます。

### 特徴(公式サイトより)
- Autosuggestions : Webブラウザライクな自動補完
- Sane Scripting : esacなど不要な文法で記述可能
- Man Page Completions：manページから自動でコマンド補完
- Glorious VGA Color：24bitカラーをサポート
- Web Based configuration Webベースの設定が可能
- Works Out of The Box：新たな学習や設定は不要

### インストール
homebrewを使用してインストールします。
```
$ brew install fish
$ fish -v
fish, version 3.0.2
```

デフォルトシェルを変更します。
```
$ sudo vi /etc/shells # 末尾に/usr/local/bin/fishを追加
$ chsh -s /usr/local/bin/fish # デフォルトシェルをfishに変更
$ fish
Welcome to fish, the friendly interactive shell
```

### Auto Suggestions
一度入力したコマンドであれば、過去の履歴からコマンドのオプションやパラメータを自動提案（Auto Suggestion）してくれます。以下は（色がないので全くわかりませんが）、AWS CLIのコマンドの途中まで入力した際にfishがこのパラメータじゃね？というのを提案してくれてます。
```
> aws ec2 describe-instances
```

### タブ補完
試しにコマンド入力し、タブキーを入力すると、確かにオプションを自動補完してくれます。以下はgitコマンドの例。
```
> git <Tab>
add                             (Add file contents to the index)
apply     (Apply a patch on a git index file and a working tree)
archive           (Create an archive of files from a named tree)
bisect  (Find the change that introduced a bug by binary search)
blame  (Show what revision and author last modified each line …)
branch                        (List, create, or delete branches)
(以下省略)
```

## Fisher
fish用のパッケージマネージャはいくつかあるようですが、Fisherを使ってみます。現時点で以下のパッケージマネージャがあるようです。
- Fisher
- Fundle
- Oh My Fish

それぞれのパッケージマネージャの違いの詳細については、下記サイトを参考に。
https://github.com/jorgebucaran/fisher/issues/481

### Fisher特徴
- 特別な設定は不要
- Oh My Fishパッケージ互換
- 高速なパッケージダウンロード
- キャッシュダウンロード機能

### システム要件
- fish 2.2+
- curl 7.10.3+
- git 1.7.12+

### インストール
ワンライナーでインストールできます。
```
> curl https://git.io/fisher --create-dirs -sLo ~/.config/fish/functions/fisher.fish
> fisher --version
fisher version 3.2.9 ~/.config/fish/functions/fisher.fish
```

### 使い方
fisherをインストールしたので、fishのプロンプトのデザインや便利なパッケージを導入してみようと思います。fishの有名どころのパッケージについては、以下のGitHubでいくつか公開されています。

https://github.com/jorgebucaran/awesome-fish

ここでは、以下のパッケージをインストールします。
- oh-my-fish/theme-bobthefish - Robust, git-aware, powerline prompt
- jethrokuan/z - Pure-fish rupa/z-like directory jumping

```
# oh-my-fish/theme-bobthefish 
> fisher add oh-my-fish/theme-bobthefish
> git clone https://github.com/powerline/fonts.git --depth=1
> cd fonts
> ./install.sh
> cd ..
> rm -rf fonts
```
iTermの場合は、「Preferences⇨Profile⇨Fonts」から Source Code Pro for Powerlineを選択します。

VSCodeのターミナルを使用する場合は、設定画面からフォントファミリの先頭に、'Source Code Pro for Powerline'を追加します。（おそらくスペースを含む場合はシングルクォートでくくる必要があります）。設定画面において、「font」で検索すると設定箇所を見つけやすいです。
また、ターミナルアプリケーション、およびターミナルにて使用するシェルも設定画面で設定可能です。ここでは、それぞれ「iTerm.app」と「/usr/local/bin/fish」を指定しています。



では、次にjethrokuan/zをインストールします。
zはディレクトリ間の移動を補完してくれるパッケージのようです。「z 文字列」のように入力すると、履歴からマッチするパスを補完してくれます。
```
# jethrokuan/z
> fisher add jethrokuan/z
> cd /User/hoge
> z hoge<Tab> # タブキーを入力すると、以下のように補完してくれる
> z /User/hoge
```

## まとめ
.bashrcや.zshrcを記載しなくとも、見栄えの変更や機能拡張をサクッと設定できる点は良いな思いました。自動補完も便利ですね。少しはスタイリッシュなターミナル環境が整ったので、触りながらより手に馴染む環境を模索していこうと思います。

## 参考
[fish公式サイト](https://fishshell.com/)

[Fisher](https://github.com/jorgebucaran/fisher)

[powerline](https://github.com/powerline/powerline)

[powerline-fonts](https://github.com/powerline/fonts)

[fish shell を使いたい人生だった](https://dev.classmethod.jp/etc/fish-shell-life/)

[fish shellが結構良かった話](https://qiita.com/hennin/items/33758226a0de8c963ddf)
