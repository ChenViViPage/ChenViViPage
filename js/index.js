var user_name = 'ChenViVi';
var repos_name = 'eden';
var access_token = 'ec2a936bb52af1e7510ad241874207a23f4dd1d7'
var page = 1;
var current_page = 1;
var page_size = 10;
var client_id = '7806cf101f835fa53876';
var client_secret = 'e934a83086472a5beff2546430260fe2281bde3d';
var articles = new Array(0);
var converter = new showdown.Converter();
var article_list;
var article_content;
var container;
$(document).ready(function () {
    article_list = $('#article-list');
    article_content = $('#article-list');
    load_more_btn = $('#load-more-btn');
    container = $('#container');
    $(".button-collapse").sideNav();
    load();
    write(0);
});

function write(start) {
    for (var i = 0; i < start + page_size; i++) {
        var article = articles[i];
        var created_at = article.updated_at.split("T");
        var updated_date = article.updated_at.split("T");
        article_list.append(
            '<div class="card hoverable z-depth-2 col s12">' +
            '<div class="card-content white-text">' +
            '<a href="#article' + article.id + '" class="card-title pink-text accent-1 article-title truncate" data-number="' + article.number + '" onclick=load_content(' + i + ')>' + article.title + '</a>' +
            '<p class="grey-text text-darken-2">' + '创建时间：' + created_at[0] + " " + created_at[1].substring(0, created_at[1].length - 1) + '</p>' +
            '<p class="grey-text text-darken-2">' + '修改时间：' + updated_date[0] + " " + updated_date[1].substring(0, updated_date[1].length - 1) + '</p>' +
            '</div>' +
            '<div class="card-action" data-id="' + article.id + '">' +
            '</div>' +
            '</div>'
        );
        var labels = article.labels;
        var labels_content = $('.card-action[data-id=' + article.id + ']');
        for (var j = 0; j < labels.length; j++)
            labels_content.append('<div class="chip" style="background-color:#' + labels[j].color + ';color:#ffffff">' + labels[j].name + '</div>');
    }
}

function load() {
    $.ajax({
        url: "https://api.github.com/repos/" + user_name + "/" + repos_name + "/issues",
        type: "get",
        dataType: 'json',
        headers: {
            Authorization: "token " + access_token
        },
        data: ("milestone=1" + "&creator=" + user_name + "&state=open" + "&page=" + page + "&per_page=" + page_size),
        async: false,
        success: function (response) {
            var length = response.length;
            if (length > 0) {
                for (var i = 0; i < length; i++) {
                    var article = response[i];
                    articles.push(article);
                }
                page++;
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            Materialize.toast("未知错误", 3000);
        }
    });
}

function load_content(number) {
    var article = articles[number];
    $('.container').html(
        '<div class="card-panel row" id="article-content">' +
        converter.makeHtml(article.body) +
        '</div>' +
        '<div id="comments"></div>'
    );
    var gitment = new Gitment({
        id: article.node_id,
        owner: user_name,
        repo: repos_name,
        oauth: {
            client_id: client_id,
            client_secret: client_secret,
        },
    });
    gitment.render('comments');
    $('pre code').each(function (i, block) {
        hljs.highlightBlock(block);
    });
    $('img').addClass('col s12');
    $('h1').addClass('col s12');
    $('h2').addClass('col s12');
    $('h3').addClass('col s12');
    $('h4').addClass('col s12');
    $('h5').addClass('col s12');
    $('p').addClass('col s12');
    $('pre').addClass('col s12');
    $('code').addClass('col s12');
    $('blockquote').addClass('col s12');
    $('pre code').each(function (i, block) {
        hljs.highlightBlock(block);
    });
}