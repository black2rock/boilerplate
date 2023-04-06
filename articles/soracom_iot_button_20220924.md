---
title: "ミルクの打刻にIoTを導入してみた" # 記事のタイトル
emoji: "☁️" # アイキャッチとして使われる絵文字（1文字だけ）
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["AWS","IoT","soracom","ベビーテック"] # タグ。["markdown", "rust", "aws"]のように指定する
published: true # 公開設定（falseにすると下書き）
published_at: 2022-09-24
---

現在育児休職を取得しています。東京都では[「育業」](https://www.metro.tokyo.lg.jp/tosei/hodohappyo/press/2022/06/29/09.html)という愛称で決定したようですが、その名の通り休んでいる暇などなく、子供の要望に応え続けていく必要があります。本記事では、子どもがミルクを飲んだ時刻をLINEに通知させる仕組みをSORACOM IoTボタンを使って実現した方法を記載します。

### 本取組みのモチベーション
子どもが３〜４時間のインターバルでミルクを飲むことが経験則としてわかってきていたので、打刻さえできれば次のミルクのおおよその時間がわかリます。子供が泣いてから対応するという受動的な育児ではなく、「そろそろお腹が空くはずだ、ミルクの準備をしておこう」という能動的な育児をITの力で実現できないか、と思い立ったのがきっかけです。 

また、夜中のミルク担当は両親のどちらかが担当することが多いと思います。そのような役割分担の場合、夜中の何時にミルクを飲んだのかは、寝ていた方の親はもちろんわかりません。「何時に飲んだの？今子どもはお腹空いてる？」と夜中対応していた親を叩き起こして聞くまでもなく、LINEの画面を見れば一目瞭然になる、というのも副次的な効果としてあるのでは？と思い開発に至りました。

### なぜIoT？
IoTを使わずとも打刻だけであれば直接LINEに文言やスタンプ等を投稿すれば良いのでは？と思われるかもしれませんが、夜中のミルク後の2時や3時にスマホからLINEを開いて投稿するというのは、スマホのブルーライトを浴びるという点や手数（スマホ開く→LINE開く→投稿）からも実施したくない、というのが個人的な思いとしてありました。ボタンを押すだけでブルーライトも浴びずに、かつ（眠い中で）最小の手数で打刻できるのはできるのはIoTのメリットと言えると思います。


### SORACOM IoT ボタンとは
![soracom_button](/image/products_soracom-lte-button_01.png) 

以下は[SORACOM LTE-M Button powered by AWS ](https://soracom.jp/store/5208/)より引用
> SORACOM LTE-M Button powered by AWSは、3種類のクリックに応じたアクションをクラウド側で設定できる、自分だけのIoTボタンを作れるデバイスです。LTE-M通信を内蔵し、単四電池で駆動しますので、Wi-Fi環境に依存せず、屋外でもご利用いただけます。

このボタンを使うことで、ネットワーク環境を意識することなく自宅はもちろん、外出先でもミルクの飲んだ時刻の打刻ができるという代物です。なぜSORACOMのボタンを採用したかについてですが、業務でAWSを使用しており、IoT系のサービスはあることは知っているけど使ったことはない（使う機会もない）という状況だったので、勉強も兼ねて使ってみることにしました。
また、[SORACOM IoT DIYレシピ](https://soracom.jp/iot-recipes/)というナレッジも公開されており、既存のレシピでLINEとの連携が掲載されていたこともあって、開発の敷居が低かったという点も挙げられます。

### 作ってみる

「[SORACOM LTE-M Button powered by AWS と LINE で作る「今から帰りますボタン」](https://soracom.jp/recipes_index/2964/#LINE_LINE_Notify)」通りに設定を進めていきました。レシピは非常にわかりやすく記載されており、スムーズに構築を進められました。

レシピの手順ではうまく動作しななかった箇所があったため、そこだけ以下に掲載します。
「LINE 通知を利用する: Lambda 関数を作成する」の箇所でLambda関数を作成するのですが、GitHubに挙げられている[コード](https://raw.githubusercontent.com/j3tm0t0/1-click/master/functions/ifttt/index.js)をそのまま使うとwebhookOptionsの箇所でうまくパラメータが拾えず、エラーとなりました。

以下に修正版のコードを記載します。
```index.js
const https = require('https');
const url = require('url');

const replaceValues = (str, e) => {
  var ret_val = str;
  ret_val = ret_val.replace('$deviceId', e.deviceInfo.deviceId)
  ret_val = ret_val.replace('$remainingLife', e.deviceInfo.remainingLife)
  ret_val = ret_val.replace('$clickType', e.deviceEvent.buttonClicked.clickType)
  ret_val = ret_val.replace('$projectName', e.placementInfo.projectName)
  ret_val = ret_val.replace('$placementName', e.placementInfo.placementName)
  ret_val = ret_val.replace(/\$([\w]+)/g,function(){return e.placementInfo.attributes[RegExp.$1] || "No Attributes named: '"+RegExp.$1 + "' found"})
  return ret_val;
}

exports.handle = function(e, ctx, cb) {
  console.log('processing event: %j', e)
  var key = e.placementInfo.attributes.key
  if(key == null)
  {
    cb("key is not defined.")
  }
  var eventName = e.placementInfo.attributes.event || e.deviceEvent.buttonClicked.clickType
  eventName = replaceValues(eventName, e)
  if(eventName == null)
  {
    cb("coudl not find eventName")
  }
  var webhookUrl = "https://maker.ifttt.com/trigger/"+eventName+"/with/key/"+key
  console.log(webhookUrl)
  var webhookOptions = url.parse(webhookUrl)

  var a = e.placementInfo.attributes
  var values = []
  var data = {}
  for(var i=1 ; i<=3 ; i++)
  {
      values[i] = a["value"+i] || ""
      values[i] = replaceValues(values[i], e)
      data['value'+i] = values[i]
  }
  var body = JSON.stringify(data)
  console.log("sending: "+body+ " to " + webhookUrl)
  webhookOptions = {
    host: "maker.ifttt.com",
    path: "/trigger/"+eventName+"/with/key/"+key,
    method: "POST",
    port: "443",
    headers: {
      'Content-Type':'application/json',
      'Content-Length': Buffer.byteLength(body)
    }
  }
  var req  = https.request (webhookOptions, function(res){
    if (res.statusCode === 200)
    {
      console.log('webhook succeeded')
      cb(null, true)
    }
    else {
      cb("webhook failed with "+res.statusCode)
    }
    return res;
  })
  req.write(body)
  req.end()
}
```

### できたもの
SORACOMボタンを押すと、夫婦のLINEグループに下図のような通知が飛ぶようになりました。
![line_iot](/image/line_iot_202303.png)

### かかったコスト
- 初期費用： 8,778 円　(SORACOM LTE-M Button powered by AWS費用。ボタン代)
- ランニングコスト：　約38円／月（AWS IoT 1 Click代）  
　※SORACOM LTE-M Buttonの更新手数料が 1,320円かかる（1年利用 or 1,500回クリック）

## まとめ＆今後の課題
初期導入費用やAWSのアカウントを用意しておかなければならないなど、最初の導入部分に少しハードルを感じる方もいるかもしれませんが、2〜3時間ちょっと（※エラー解析等除く）でなんちゃって打刻システムが個人で作れました。
ミルクを飲ませた後ボタンを押すのを忘れる、といった本末転倒なこともたまにありますが、「今日はあまりミルク飲まないね、ウンチが溜まってるのかな」等、子どもの体調を推測することにも使っていたりします。

今回1回ボタンを押すことでミルク飲んだよ通知する仕組みを作りましたが、2回連続で押下した場合や長時間押下した場合の挙動も設定できるため、例えば2回連続で押したらウンチしたことを通知する、といった仕組みも作れるかと思っています。

また、今後子どもが大きくなっていき、学校や塾等の習い事で迎えにきてほしいタイミングでボタンを押してもらって、親に連絡するといった今後のボタンの活用法もあると思っています。日曜大工みたいなノリで、こういったIoTデバイスをうまく日常に活用していきたいなと思いました。

## 参考
- [SORACOM LTE-M Button powered by AWS ](https://soracom.jp/store/5208/)　
- [SORACOM IoT レシピ：IoTで呼び出しシステム](https://soracom.jp/recipes_index/2964/#LINE_LINE_Notify)