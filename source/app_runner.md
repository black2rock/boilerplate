# とあるホームページをAWS App Runnerに移行してみた


## App Runnerとは

```
以前は、App Runner アプリケーションがこれらのリソースに接続するには、インターネット経由でパブリックアクセスされている必要がありました。この機能により、App Runner アプリケーションは VPC 内のプライベートエンドポイントに接続でき、これらのリソースへのパブリックアクセスを削除することで、より安全でコンプライアンスに準拠した環境を実現できます
```

## なぜApp Runnerを採用？


## 移行前の環境
- CentOS 5
- Perl 5.8.8
- PHP 5.2.9
- cakePHP 1.3.16
- Python 2.4.3
- MySQL 5.0.83
- PostgreSQL 8.1.23
- SQLite 3.3.6
 
## 移行の流れ
1. 移行元環境の確認
2. 移行先検討（AWSのどのサービスを使うか）
3. 移行前準備
4. 移行作業

### 1.移行元環境の確認
### 2.移行先検討（AWSのどのサービスを使うか）
すでに冒頭で答えを述べていますが、移行先としてApp Runnerを採用しました。
移行先として候補に挙げたのは以下のサービスになります。
EC2, ECS＋EC2,EKSなどは運用が大変なので、比較検討から除外しています。


|             | LightSail  | Elastic Beanstalk | App Runner | Amplify | ECS+Fargate |
|:----------- |:-----------|:------------|:------------|:------------|:------------|
| 移行容易性    | ?      | ?        | 3         | 3         | 3        |
| 運用の楽さ    | 3     | 2     | column       |This         |This         |
| コスト       |        | will        | will         |This         |This         |
| モチベーション|         | be          | be           |This         |This         |
| 備考         |        | 実態はEC2インスタンスが作成されebコマンドで制御する形なので、EC2のセキュリティ対策は考慮が必要（例、パッチ適用／アンチウィルス対策）      | center       |This         |This         |

### 3.移行前準備

作業環境でコンテナ環境を整えつつ、コンテナイメージを作成します。
#### 作業環境
<後でコピー>

#### Podmanインストール
移行元環境がCentOSだったため、コンテナエンジンとして、RedHat系OSと親和性の高いPodmanを使うことにしました。

```
> brew install podman podman-compose
> brew install --cask podman-desktop
> vim Dockerfile
ROM php:apache
WORKDIR /var/www/html
# カレントディレクトリにある資材をコンテナ内の/var/www/html配下にコピーする
COPY . /var/www/html
CMD [ "php", "./index.php" ]
> podman buid -t php-test .
> podman run -itd --rm --name my-php-app php-test:latest  /bin/bash
> podman attach my-php-app


> aws ecr get-login-password --region ap-northeast-1 | podman login --username AWS --password-stdin xxxxxxxxxxxx.dkr.ecr.ap-northeast-1.amazonaws.com
Login Succeeded!
> podman tag php-test:latest xxxxxxxxxxx.dkr.ecr.ap-northeast-1.amazonaws.com/kidsgarden:latest
> podman push xxxxxxxxxxxxx.dkr.ecr.ap-northeast-1.amazonaws.com/kidsgarden:latest

```
### 4.移行作業



## 参考
- [Code Commit料金](https://aws.amazon.com/jp/codecommit/pricing/)
- [ECR料金](https://aws.amazon.com/jp/ecr/pricing/)
- [Running Applications Across Elastic Beanstalk and AWS App Runner](https://pages.awscloud.com/Running-Applications-Across-Elastic-Beanstalk-and-AWS-App-Runner_2021_1010-CON_OD.html)
- [How to choose between AWS Elastic Beanstalk and App Runner services?](https://stackoverflow.com/questions/68615761/how-to-choose-between-aws-elastic-beanstalk-and-app-runner-services)
- [AWS App Runner のご紹介](https://aws.amazon.com/jp/blogs/news/introducing-aws-app-runner/)
- [App Runner の新機能 — Amazon Virtual Private Cloud (VPC) をサポート](https://aws.amazon.com/jp/blogs/news/new-for-app-runner-vpc-support/)
- [Amazon Lightsail](https://pages.awscloud.com/rs/112-TZM-766/images/20170118_AWS-Blackbelt-Lightsail-public02.pdf)
- [CentOS 8で、Dockerの代替らしい Podman を少し使ってみる](https://nishipy.com/archives/1378)
- [DockerとPodman/Skopeo/Buildahは何が違うのか？](https://qiita.com/caunu-s/items/4fa0e0465ea83fcc06e4)