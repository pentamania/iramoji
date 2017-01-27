=begin
いらすとやサイトから必要イメージを一括ダウンロード
先方のサーバーに負担をかけないよう、実行は最小限に
=end

require 'open-uri'
require 'nokogiri'

# target_url = 'http://www.irasutoya.com/2013/03/blog-post_2894.html' # alphabet
# target_url = 'http://www.irasutoya.com/2013/02/50.html' # hiragana
# target_url = 'http://www.irasutoya.com/2013/03/50.html' # katakana
# target_url = 'http://www.irasutoya.com/2013/02/blog-post_4564.html' # number
# target_url = 'http://www.irasutoya.com/2014/05/blog-post_3575.html' # chinese-number
# target_url = 'http://www.irasutoya.com/2014/10/blog-post_899.html' # roman-number
# target_url = 'http://www.irasutoya.com/2014/08/blog-post_238.html' # alphabet-chara

@ary = Array.new

## charset 指定
# charset = nil
# html = open(target_url) do |f|
#     charset = f.charset # 文字種別を取得
#     f.read #htmlを読み込み変数htmlに渡します。
# end

# 指定したサイトの画像ファイルリンクの一覧の取得、配列で返す
def get_anchor_url(url)
    doc = Nokogiri::HTML(open(url))
    ary = Array.new
    target_class = doc.css('.entry')

    target_class.search("a").each do |a|
        # アンカーリンクの行末が画像ファイル形式
        if /\.(jpg|png|gif)$/ =~ a['href']
            ary << a['href']
        end
    end

    return ary
end

def download_files(ary)
    ary.each do |url|
        # ファイル名指定（オリジナルのファイル名を採用）
        filename = File.basename(url)

        # 保存フォルダ作成（なければ）
        folderDir = "./out/"
        FileUtils.mkdir_p(folderDir) unless FileTest.exist?(folderDir)

        p filename # ログ出力

        # ファイルを保存するディレクトリ名を指定
        dirname = folderDir + filename
        open(dirname, 'wb') do |file|
            open(url) do |data|
                file.write(data.read)
            end
        end
    end
end

#実行
# @ary = get_anchor_url(target_url)
download_files(get_anchor_url(target_url))

# doc = Nokogiri::HTML.parse(html, nil, charset) #htmlを解析し、オブジェクト化

#取得したいタグ名を指定します。
# target = doc.search('title')

#取得したデータをテキストに変換
# p target