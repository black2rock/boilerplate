# tig使ってみた

gitクライアントツールでtigなるものがあると知り、使ってみました。
## 動作環境
macOS Mojave
(バージョン10.14.4)

## tigとは
ncursesベースのgitのテキストモードインターフェースツールです。（※ncursesとは、端末のテキストユーザインタフェース（TUI）を作成する際のライブラリのこと）

### インストール
homebrewを使用してインストールします。
```
$ brew install tig
$ tig --version
tig version 2.4.1
ncurses version 5.7.20081102
readline version 8.0
```

### 使い方
とりあえず、tigコマンドを叩きます。
```
tig
```

tigには、複数のビューが存在しており、
viライクなコマンドでビューを切り替えて操作します。

| コマンド | アクション | 
| --- | --- |
| m | mainビューへ切り替え | 
| d | diffビューへ切り替え | 
| l | logビューへ切り替え | 
| p | pagerビューへ切り替え | 
| t | (directory) treeビューへ切り替え | 
| f | file blobビューへ切り替え | 
| g | grepビューへ切り替え | 
| b | blameビューへ切り替え | 
| r | refsビューへ切り替え |
| y | stashビューへ切り替え |
| h | helpビューへ切り替え |
| s | statusビューへ切り替え |
| c | stageビューへ切り替え |

各ビューに置けるカーソルの操作は、まさにvi操作と同様、j,kやCtl+d,Ctl+uで上下操作します。
操作についての詳細は、マニュアルに詳しく記載されているためここでは割愛します。

### tigを使ってadd/commitを実行してみる
tig.mdというファイルを新規に作成し、git add/commitをtigコマンドで実施してみます。

```
$ tig  # tigコマンド実行後、mainビューにてsを押下
Changes to be committed:
  (no files)
Changes not staged for commit:
  (no files)
Untracked files:
? tig.md  
```

Untracked filesに新規作成したファイルが表示されています。このファイルをステージングエリアに追加したい場合、当該ファイルにカーソルを合わせ「u」を押下します。すると、以下のようにChanges to be committedにファイルが移動し、git add相当が実施できます。
ちなみに、再度「u」を押下すると、アンステージング（ステージングエリアから削除）することも可能です。
```
Changes to be committed:
A tig.md 
Changes not staged for commit:
  (no files)
Untracked files:
  (no files)
```

次にcommitですが、statusビューにおいて、「C（Shift+c）」を押下することで、commit可能です。以下のようにコミットメッセージ画面が表示されます。
注意点としては、mainビューでは、C（Shift+c）」はcherry-pickを意味するので、必ずstatusビューで実行してください。

```
add tig.md

 # Please enter the commit message for your changes. Lines st    arting
 # with '#' will be ignored, and an empty message aborts the     commit.
 #
 # On branch master
 # Changes to be committed:
 #       new file:   tig.md
```

コミットメッセージを記載し「:wq」で保存後、再度statusビューを開くと以下のようにステータスが変更されています。

```
Changes to be committed:
  (no files)
Changes not staged for commit:
M tig.md 
Untracked files:
  (no files)
```

pushですが、現在(version 2.4.1)のtigでは対応していません。以下のissueにも挙がっていますが、tigはあくまでビュワーのため、あえて実装していないとのこと。
https://github.com/jonas/tig/issues/199

もしtig上でpushもカバーしたい、というのであれば、~/.tigrcにコマンドのバインディングの設定を記載すれば可能なようです。以下はstatusビューにおいて、P（shift+p）にgit push originをバインドする設定。

```:.tigrc 
bind status P !git push origin
```
## 参考
[tig公式サイト](https://github.com/jonas/tig)

[tigでgitをもっと便利に！ addやcommitも](https://qiita.com/suino/items/b0dae7e00bd7165f79ea)