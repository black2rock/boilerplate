# Mac mini（M1,2020） セットアップ備忘録
Mac miniのセットアップ手順（普段使うツール類を導入するまで）を備忘録として記載します。

## 動作環境
- Mac mini (M1, 2020)
- macOS Monterey(バージョン12.3.1)

## 初期設定
キーボードとマウスは普段以下を使用していますが、やはりというべきか初期セットアップ（言語の設定やネットワークの設定等）ではBluetoothの設定ができないため、別の（USBコネクタ対応の）キーボード、マウスを使用してセットアップを実施しました。
 - キーボード：logicool MX Keys Mini
 - マウス：logicool MX Ergo

初期セットアップ後、[システム環境設定]->[Bluetooth]でキーボード／マウスを繋いで設定しました。
キーボードについて、キーボード設定アシスタントを使ってJIS（日本語）にセットアップしましたが、英語配列のまま変わらず、、、という状況になりましたが、Ctrl+Spaceで英語(ABC)→日本語へ変換すると、日本語配列に設定できました（ここはあまり腑に落ちてないところですが、設定できたので次に進みます）

## 各種ツールのセットアップ
以下の流れでセットアップを実施します。
1. brewインストール(Xcodeのインストール含む)
2. fishの設定
3. VSCodeの設定
4. Firefoxの設定

### 1.brewインストール
[Homebrew](https://brew.sh/index_ja)に記載されているワンライナーのコマンド実行してインストールします。

````
% /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
````
上記Homebrewインストールの中でXcodeについてもインストールされます。  
インストールが終わると次のアクションについての出力があるので、それに従ってコマンド実行していきます。
要はbrewコマンドが使えるようにパスの設定をzshのプロファイルに設定しましょう、ということです。
````
% echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> /Users/hoge/.zprofile
% eval "$(/opt/homebrew/bin/brew shellenv)"
````

これでbrewのインストールは完了です。  
続いてbrew経由で普段使用しているツール類をインストールしていきます。
````
% brew install git fish ghq peco
% brew install --cask firefox quicksilver visual-studio-code shiftit karabiner-elements
````

fishは普段使用しているシェルになります。詳細は[fish shell導入してみた](https://gitpress.io/u/879/fish)にて紹介しているので割愛します。
ghqやpecoについてはgit周りの作業改善ツールです。正直使ったことがなかったので、このMac miniセットアップを機に使っていこうと思います。  
Quicksilverはランチャーツールです。MacだとAlfredなどが有名かと思いますが、
[Apple Silicon MacやmacOS 12 Montereyに対応した多機能ランチャー「Quicksilver v2.0」がリリース](https://applech2.com/archives/20220401-quicksilver-v2-for-mac-now-avalable.html)の記事を見かけ、久しぶりにQuicksilverを使ってみようと思って導入してます（QuicksilverのBezel型のポップアップが好みです。デフォルトはPrimer型になっているのでBezel型に変更してます)  
shiftitはウィンドウ分割ツールです。Windowsライクにウィンドウを移動させたいことが多いので導入してます。shiftitのデフォルト設定では「Ctrl+Opt+⌘+カーソルキー」という形で若干使いづらいため、「⌘→」で右にウィンドウを移動みたいな形に設定しています。
karabiner-elementsはキーバインドをカスタマイズするツールです。Windowsキーボード操作に慣れているため、Windowsっぽくキーバインドを変更するために使用します。

karabiner-elementsでは、下図のようにコピペがWindowsと同じキー操作となるようにCommandとControlのキー配置を入れ替えます。
![karabiner-elements01](/mac_m1/01.png)

ただ、上記設定をしてしまうとウィンドウの切り替えがWindows操作時とは異なってしまうため、Command+TabをControl+Tabに変更します（下図）。ルールについてはインターネットからダンロードできるのでインポート＆有効化します。
![karabiner-elements2](/mac_m1/02.png)

### 2. fishの設定
Mac mini(M1, 2020)では、デフォルトのシェルがzshとなっているのでfishに変更します。
また、fishでbrewが使用できるようにパスの設定を実施します。
````
% echo $SHELL
/bin/zsh
% whereis fish 
fish: /opt/homebrew/bin/fish /opt/homebrew/share/man/man1/fish.1                                                             
% echo /opt/homebrew/bin/fish | sudo tee -a /etc/shells
% chsh -s /opt/homebrew/bin/fish
% vim ~/.config/fish/config.fish
% cat ~/.config/fish/config.fish
if status is-interactive
    # Commands to run in interactive sessions can go here
    eval "$(/opt/homebrew/bin/brew shellenv)"
end
`````

fish用のパッケージマネージャとしてFisherを使います。
```
% curl https://git.io/fisher --create-dirs -sLo ~/.config/fish/functions/fisher.fish
% fisher --version
fisher version 4.3.1
```

文字化けするようなのでPowerlineフォントをインストールフォントについてダウンロードします。  
(以前はfisher add <プラグイン>という形でしたが、fisher installという形に変わってます)
````
% fisher install oh-my-fish/theme-bobthefish jethrokuan/z oh-my-fish/plugin-peco
% git clone https://github.com/powerline/fonts.git
% cd fonts
% ./install.sh
% cd ../
% rm -rf fonts
````


### 3.VSCodeの設定
VSCodeインストール後、以下の拡張機能をインストールします。核拡張機能の説明は省略します。
##### $拡張機能$
- Dracula Official
- GitLens
- HashiCorp Terraform
- Japanese Language Package
- Kubernetes
- Markdown All in one
- markdownlint
- Vim
- YAML

VSCodeのターミナルを多用するため、デフォルトのシェルをfishに変更します。  
Code->基本設定->設定の「Terminal>Integrated>Default Profile:Osx」のパラメータをnullからfishに変更します。また、VSCodeのターミナルを使用する場合は、設定画面からフォントファミリの先頭に、'Source Code Pro for Powerline'を追加します。（おそらくスペースを含む場合はシングルクォートでくくる必要があります）。設定画面において「font」で検索すると設定箇所を見つけやすいです。

また、[Settings Sync](https://code.visualstudio.com/docs/editor/settings-sync)を参考に、VSCodeの設定ファイル（Settings.json）の同期をGitHub経由で連携する設定をしました。同期設定をするとGitHub上にVSCode用の新しいリポジトリが作成されるわけではありませんでした。どこまで同期させるか（同期拒否させるか）はjsonファイルで細かく設定できるようです。


## まとめ
Apple Storeで注文してから約2週間後にMac miniが届いたので、セットアップがてら手順を備忘録として残してみました。メモリとストレージをカスタマイズしたことでAppleの中国支店経由で発送される形になったようですが、コロナ禍で発送にかなりの遅延が発生しているようです（配送予定日より10日程遅れて届きました）。が、やはり新しいマシンはいいですね。とりあえずのセットアップが完了したので、色々試しながらカスタマイズしていきたいと思います。


## 参考
[ghqでリポジトリ管理とpeco連携で快適git生活](https://qiita.com/strsk/items/9151cef7e68f0746820d)

[Settings Sync](https://code.visualstudio.com/docs/editor/settings-sync)

[Apple Silicon MacやmacOS 12 Montereyに対応した多機能ランチャー「Quicksilver v2.0」がリリース](https://applech2.com/archives/20220401-quicksilver-v2-for-mac-now-avalable.html)