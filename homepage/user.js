$(document).ready(function () {
    if(window.sessionStorage.getItem('ID_KEY')==null){
        window.location.assign("../index.html");
    }
    getListPost();
    showUser();
    showListFriend();
    showListAddFriend();
    $('#reloadAvatar').hide();
    $('#avatarUser').click(function () {
        $("#reloadAvatar").show();
    });
    $('#closeupload').click(function () {
        $("#reloadAvatar").hide();
    });
})

function showUserDetail() {
    let idAcc = window.sessionStorage.getItem('ID_KEY');
    $('#posts').show();
    $.ajax({
        url: 'https://vilo-vn.herokuapp.com/user/showuserdetail/' + idAcc,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': window.sessionStorage.getItem('TOKEN_KEY')
        },
        success: function (data) {
            let resulf = "";
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    resulf += '<div id="post' + data[i].id + '">';
                    if (data[i].account.id == window.sessionStorage.getItem('ID_KEY')) {
                        resulf +=
                            '<table><tr style="width: 450px">' +
                            '<td>' + data[i].account.fullName + '</td>' +
                            '<td>&nbsp;&nbsp;&nbsp;&nbsp;Trạng thái:' + data[i].privacy + '</td>' +
                            '<td><button type="button" class="btn btn-outline-primary" onclick="editPost(' + data[i].id + ')"> <i class="fas fa-wrench"></i> </button></td>' +
                            '<td><button type="button" class="btn btn-outline-danger" onclick="deletePost(' + data[i].id + ')"> <i class="fas fa-trash"></i> </button></td>' +
                            '</tr></table>';
                    } else {
                        resulf +=
                            '<table><tr style="width: 450px">' +
                            '<td>' + data[i].account.fullName + '</td>' +
                            '<td>&nbsp;&nbsp;&nbsp;&nbsp;Trạng thái:' + data[i].privacy + '</td>' +
                            '</tr></table>';
                    }
                    resulf +=
                        '<p>' + data[i].conten + '</p>';
                    if (data[i].imageList[0].path != "") {
                        resulf += '<p><img width="500px" height="auto" src=' + data[i].imageList[0].path + '/></p>';
                    }
                    resulf +=
                        '<p>' + data[i].likeList.length + ' <i class="fas fa-heart" style="color: lime"></i> &nbsp;&nbsp;' + data[i].commentList.length + ' Bình luận</p>' +
                        '<button type="button" class="btn btn-danger" onclick="createLike(' + data[i].id + ')"> Like </button>' +
                        '<input style="width: 350px;height: 38px" type="text" id="comment' + data[i].id + '"/>' +
                        '<button type="button" class="btn btn-outline-success" onclick="createCm(' + data[i].id + ')"> Bình luận </button>';
                    for (let j = 0; j < data[i].commentList.length; j++) {
                        if (data[i].commentList[j].account.id == window.sessionStorage.getItem('ID_KEY')) {
                            resulf += '<p style="color: blue;font-size: 15px">' + data[i].commentList[j].account.fullName + '<button type="button" class="btn btn-outline-info" onclick="deleteComment(' + data[i].commentList[j].id + ',' + data[i].id + ')"> <i class="fas fa-trash"></i> </button></p>';
                        } else {
                            resulf += '<p style="color: blue;font-size: 15px">' + data[i].commentList[j].account.fullName + '</p>';

                        }
                        resulf += '<p>' + data[i].commentList[j].content + '</p>';
                    }
                    resulf += '</div><hr><br>';
                }

            }
            document.getElementById("listpost").innerHTML = resulf;
        },
        error: function () {
            document.getElementById("listpost").innerHTML = "";
        }
    })
    event.preventDefault();
}

function editPost(idPost) {
}

function deletePost(idPost) {
    $.ajax({
        url: 'https://vilo-vn.herokuapp.com/user/deletepost/' + idPost,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': window.sessionStorage.getItem('TOKEN_KEY')
        },
        success: function () {
            homepage();
        },
        error: function () {
            homepage();
        }
    })
    event.preventDefault();
}

function homepage() {
    $('#posts').show();
    document.getElementById("listpost").innerHTML = "";
    document.getElementById("page").value = 0;
    getListPost();
    event.preventDefault();
}

function showListAddFriend() {
    let idAcc = window.sessionStorage.getItem('ID_KEY');
    $.ajax({
        url: 'https://vilo-vn.herokuapp.com/user/showrequestfriend/' + idAcc,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': window.sessionStorage.getItem('TOKEN_KEY')
        },
        success: function (data) {
            let result = "<table>";
            for (let i = 0; i < data.length; i++) {
                result +=
                    '<tr>' +
                    '<td><img width="50px" height="50px" src=' + data[i].avatar.path + '/></td>' +
                    '<td><p>' + data[i].fullName + '</p></td>'
                    + '</tr><tr>' +
                    '<td><button style="width: 65px;font-size: 12px" type="button" class="btn btn-outline-primary" onclick="confirmFriend(' + data[i].id + ')">Đồng ý</button></td>' +
                    '<td><button style="width: 65px;font-size: 12px" type="button" class="btn btn-outline-danger" onclick="refuseFriend(' + data[i].id + ')">Từ chối</button></td>' +
                    '</tr>'
                ;
            }
            result += "</table>";
            document.getElementById('alert').innerHTML = result;
        },
        error: function () {
            document.getElementById('alert').innerHTML = "";
        }
    })
    event.preventDefault();
}

function refuseFriend(idFriend) {
    let idAcc = window.sessionStorage.getItem('ID_KEY');
    $.ajax({
        url: 'https://vilo-vn.herokuapp.com/user/refuse/' + idAcc + '/' + idFriend,
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': window.sessionStorage.getItem('TOKEN_KEY')
        },
        success: function () {
            showListAddFriend();
        },
        error: function () {
            showListAddFriend();
        }
    })
    event.preventDefault();
}

function confirmFriend(idFriend) {
    let idAcc = window.sessionStorage.getItem('ID_KEY');
    $.ajax({
        url: 'https://vilo-vn.herokuapp.com/user/confirmfriend/' + idAcc + '/' + idFriend,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': window.sessionStorage.getItem('TOKEN_KEY')
        },
        success: function () {
            showListFriend();
            showListAddFriend();
        },
        error: function () {
            showListFriend();
            showListAddFriend();
        }
    })
    event.preventDefault();
}

function showListFriend() {
    let idAcc = window.sessionStorage.getItem('ID_KEY');
    $.ajax({
        url: 'https://vilo-vn.herokuapp.com/user/showfriend/' + idAcc,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': window.sessionStorage.getItem('TOKEN_KEY')
        },
        success: function (data) {
            let result = "<table>";
            for (let i = 0; i < data.length; i++) {
                result +=
                    '<tr>' +
                    '<td><img width="50px" height="50px" src=' + data[i].avatar.path + '/></td>' +
                    '<td><a href="" onclick="showFriendDetail(' + data[i].id + ')">' + data[i].fullName + '</a></td>' +
                    '</tr>';
            }
            result += "</table>";
            document.getElementById('friend').innerHTML = result;
            document.getElementById('countfriend').innerText = data.length;
        },
        error: function () {
            document.getElementById('friend').innerHTML = "";
        }
    })
    event.preventDefault();
}

function showFriendDetail(idFriend) {
    $('#posts').hide();
    $.ajax({
        url: 'https://vilo-vn.herokuapp.com/user/showpostfriend/' + idFriend,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': window.sessionStorage.getItem('TOKEN_KEY')
        },
        success: function (data) {
            let resulf = "";
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    console.log(data[i].account);
                    resulf += '<div id="post' + data[i].id + '">';
                    if (data[i].account.id == window.sessionStorage.getItem('ID_KEY')) {
                        resulf +=
                            '<table><tr style="width: 450px">' +
                            '<td>' + data[i].account.fullName + '</td>' +
                            '<td>&nbsp;&nbsp;&nbsp;&nbsp;Trạng thái:' + data[i].privacy + '</td>' +
                            '<td><button type="button" class="btn btn-outline-primary" onclick="editPost(' + data[i].id + ')"> <i class="fas fa-wrench"></i> </button></td>' +
                            '<td><button type="button" class="btn btn-outline-danger" onclick="deletePost(' + data[i].id + ')"> <i class="fas fa-trash"></i> </button></td>' +
                            '</tr></table>';
                    } else {
                        resulf +=
                            '<table><tr style="width: 450px">' +
                            '<td>' + data[i].account.fullName + '</td>' +
                            '<td>&nbsp;&nbsp;&nbsp;&nbsp;Trạng thái:' + data[i].privacy + '</td>' +
                            '</tr></table>';
                    }
                    resulf +=
                        '<p>' + data[i].conten + '</p>';
                    if (data[i].imageList[0].path != "") {
                        resulf += '<p><img width="500px" height="auto" src=' + data[i].imageList[0].path + '/></p>';
                    }
                    resulf +=
                        '<p>' + data[i].likeList.length + ' <i class="fas fa-heart" style="color: lime"></i> &nbsp;&nbsp;' + data[i].commentList.length + '  Bình luận</p>' +
                        '<button type="button" class="btn btn-danger" onclick="createLike(' + data[i].id + ')"> Like </button>' +
                        '<input style="width: 350px;height: 38px" type="text"  id="comment' + data[i].id + '"/>' +
                        '<button type="button" class="btn btn-outline-success" onclick="createCm(' + data[i].id + ')"> Bình luận </button>';
                    for (let j = 0; j < data[i].commentList.length; j++) {
                        if (data[i].commentList[j].account.id == window.sessionStorage.getItem('ID_KEY')) {
                            resulf += '<p style="color: blue;font-size: 15px">' + data[i].commentList[j].account.fullName + '<button class="btn btn-outline-info" onclick="deleteComment(' + data[i].commentList[j].id + ',' + data[i].id + ')"> <i class="fas fa-trash"></i> </button></p>';
                        } else {
                            resulf += '<p style="color: blue;font-size: 15px">' + data[i].commentList[j].account.fullName + '</p>';

                        }
                        resulf += '<p>' + data[i].commentList[j].content + '</p>';
                    }
                    resulf += '</div><hr><br>';
                }

            }
            document.getElementById("listpost").innerHTML = resulf;
        },
        error: function () {
            document.getElementById("listpost").innerHTML = "";
        }
    })
    event.preventDefault();
};

function showUser() {
    let image = '<img class="profile-pic" src=' + window.sessionStorage.getItem('AVATAR_KEY') + '/>';
    let fullname = window.sessionStorage.getItem('FULLNAME_KEY')
    document.getElementById('avatarUser').innerHTML = image;
    document.getElementById('nameUser').innerText = fullname;
}

function logout() {

    window.sessionStorage.removeItem('TOKEN_KEY');
    window.sessionStorage.removeItem('ID_KEY');
    window.sessionStorage.removeItem('FULLNAME_KEY');
    window.sessionStorage.removeItem('AVATAR_KEY');
    window.location.href = "../index.html";
    event.preventDefault();
}

function searchFriend() {
    let email = $('#email').val();
    let account = {email: email};
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': window.sessionStorage.getItem('TOKEN_KEY')
        },
        data: JSON.stringify(account),
        type: "POST",
        url: 'https://vilo-vn.herokuapp.com/user/searchfriend',
        success: function (data) {
            console.log(data)
            let result = ""
            if (data.id == window.sessionStorage.getItem('ID_KEY')) {
                result += '<img src="https://i-ione.vnecdn.net/2018/03/22/ezgifcomresize1-1521716616.gif" width="190px" height="auto">';
            } else {
                result +=
                    '<table><tr>' +
                    '<td><img width="50px" height="50px" src=' + data.avatar.path + '/></td>' +
                    '<td><p>' + data.fullName + '</p></td>' +
                    '<td><button type="button"  onclick="addFriend(' + data.id + ')"> <i class="fas fa-user-plus"></i> </button></td>' +
                    '</tr></table>';

            }
            document.getElementById('refriend').innerHTML = result;
        },
        error: function () {
            let result = '<p>Không tìm thấy</p>';
            document.getElementById('refriend').innerHTML = result;
        }
    })
}

function addFriend(idFriend) {
    let idAcc = window.sessionStorage.getItem('ID_KEY');
    $.ajax({
        url: 'https://vilo-vn.herokuapp.com/user/sendaddfriend/' + idAcc + '/' + idFriend,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': window.sessionStorage.getItem('TOKEN_KEY')
        },
        success: function () {
            document.getElementById('refriend').innerHTML = "";
        },
        error: function () {
            document.getElementById('refriend').innerHTML = "";
        }
    })
    event.preventDefault();
}

function getListPost() {
    let page = $('#page').val();
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': window.sessionStorage.getItem('TOKEN_KEY')
        },
        data: page,
        type: "POST",
        url: 'https://vilo-vn.herokuapp.com/user/timeline',
        success: function (data) {
            showPost(data);
        }
    })
    event.preventDefault();
}

function showPost(data) {
    let resulf = "";
    if (data.content.length > 0) {
        document.getElementById("page").value = data.number + 1;
        $('#continueshow').remove();
        for (let i = 0; i < data.content.length; i++) {
            resulf += '<div id="post' + data.content[i].id + '">';
            if (data.content[i].account.id == window.sessionStorage.getItem('ID_KEY')) {
                resulf +=
                    '<table><tr style="width: 450px">' +
                    '<td>' + data.content[i].account.fullName + '</td>' +
                    '<td>&nbsp;&nbsp;&nbsp;&nbsp;Trạng thái:' + data.content[i].privacy + '</td>' +
                    '<td><button type="button" class="btn btn-outline-primary" onclick="editPost(' + data.content[i].id + ')"> <i class="fas fa-wrench"></i> </button></td>' +
                    '<td><button type="button" class="btn btn-outline-danger" onclick="deletePost(' + data.content[i].id + ')"> <i class="fas fa-trash"></i> </button></td>' +
                    '</tr></table>';
            } else {
                resulf +=
                    '<table><tr style="width: 450px">' +
                    '<td>' + data.content[i].account.fullName + '</td>' +
                    '<td>&nbsp;&nbsp;&nbsp;&nbsp;Trạng thái:' + data.content[i].privacy + '</td>' +
                    '</tr></table>';
            }
            resulf +=
                '<p>' + data.content[i].conten + '</p>';
            if (data.content[i].imageList[0].path != "") {
                resulf += '<p><img width="500px" height="auto" src=' + data.content[i].imageList[0].path + '/></p>';
            }
            resulf +=
                '<p>' + data.content[i].likeList.length + ' <i class="fas fa-heart" style="color: lime"></i>&nbsp;&nbsp;' + data.content[i].commentList.length + ' Bình luận</p>' +
                '<button type="button" class="btn btn-danger" onclick="createLike(' + data.content[i].id + ')"> Like </button>' +
                '<input style="width: 350px;height: 38px" type="text"  id="comment' + data.content[i].id + '"/>' +
                '<button type="button" class="btn btn-outline-success" onclick="createCm(' + data.content[i].id + ')"> Bình luận </button>';
            for (let j = 0; j < data.content[i].commentList.length; j++) {
                if (data.content[i].commentList[j].account.id == window.sessionStorage.getItem('ID_KEY')) {
                    resulf += '<p style="color: blue;font-size: 15px">' + data.content[i].commentList[j].account.fullName + '<button class="btn btn-outline-info" onclick="deleteComment(' + data.content[i].commentList[j].id + ',' + data.content[i].id + ')"> <i class="fas fa-trash"></i> </button></p>';
                } else {
                    resulf += '<p style="color: blue;font-size: 15px">' + data.content[i].commentList[j].account.fullName + '</p>';

                }
                resulf += '<p>' + data.content[i].commentList[j].content + '</p>';
            }
            resulf += '</div><hr><br>';
        }
        if (!data.last) {
            resulf += '<button type="button" class="btn btn-outline-primary"  id="continueshow" onclick="continuePost()"> Xem Thêm </button>';
        }
    }

    let divLocation = document.getElementById("listpost");
    let element = document.createElement("div");
    element.innerHTML = resulf;
    divLocation.append(element);
}

function continuePost() {
    getListPost();
}

function deleteComment(idComment, idPost) {
    $.ajax({
        url: 'https://vilo-vn.herokuapp.com/user/deletecomment/' + idComment,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': window.sessionStorage.getItem('TOKEN_KEY')
        },
        success: function () {
            showRePost(idPost);
        },
        error: function () {
            showRePost(idPost);
        }
    })
    event.preventDefault();
}

function createLike(idPost) {
    let idAcc = window.sessionStorage.getItem('ID_KEY');
    $.ajax({
        url: 'https://vilo-vn.herokuapp.com/user/likeshow/' + idAcc + '/' + idPost,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': window.sessionStorage.getItem('TOKEN_KEY')
        },
        dataType: 'json',
        success: function () {
            showRePost(idPost);
        },
        error: function () {
            showRePost(idPost);
        }
    })
    event.preventDefault();
}

function showRePost(idPost) {
    $.ajax({
        url: 'https://vilo-vn.herokuapp.com/user/findPost/' + idPost,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': window.sessionStorage.getItem('TOKEN_KEY')
        },
        success: function (data) {
            let result = "";
            if (data.account.id == window.sessionStorage.getItem('ID_KEY')) {
                result +=
                    '<table><tr style="width: 450px">' +
                    '<td>' + data.account.fullName + '</td>' +
                    '<td>&nbsp;&nbsp;&nbsp;&nbsp;Trạng thái:' + data.privacy + '</td>' +
                    '<td><button type="button" class="btn btn-outline-primary" onclick="editPost(' + data.id + ')"> <i class="fas fa-wrench"></i> </button></td>' +
                    '<td><button type="button" class="btn btn-outline-danger" onclick="deletePost(' + data.id + ')"> <i class="fas fa-trash"></i> </button></td>' +
                    '</tr></table>';
            } else {
                result +=
                    '<table><tr style="width: 450px">' +
                    '<td>' + data.account.fullName + '</td>' +
                    '<td>     Trạng thái:' + data.privacy + '</td>' +
                    '</tr></table>';
            }

            result +=
                '<p>' + data.conten + '</p>';
            if (data.imageList[0].path != "") {
                result += '<p><img width="500px" height="auto" src=' + data.imageList[0].path + '/></p>';
            }
            result +=
                '<p>' + data.likeList.length + ' <i class="fas fa-heart" style="color: lime"></i> &nbsp;&nbsp;' + data.commentList.length + '  Bình luận</p>' +
                '<button type="button" class="btn btn-danger" onclick="createLike(' + data.id + ')"> Like </button>' +
                '<input style="width: 350px;height: 38px" type="text" id="comment' + data.id + '"/>' +
                '<button type="button" class="btn btn-outline-success" onclick="createCm(' + data.id + ')"> Bình luận </button>';
            for (let j = 0; j < data.commentList.length; j++) {
                if (data.commentList[j].account.id == window.sessionStorage.getItem('ID_KEY')) {
                    result += '<p style="color: blue;font-size: 15px">' + data.commentList[j].account.fullName + '<button type="button" class="btn btn-outline-info" onclick="deleteComment(' + data.commentList[j].id + ',' + data.id + ')"> <i class="fas fa-trash"></i> </button></p>';
                } else {
                    result += '<p style="color: blue;font-size: 15px">' + data.commentList[j].account.fullName + '</p>';

                }
                result += '<p>' + data.commentList[j].content + '</p>';
            }
            document.getElementById("post" + idPost).innerHTML = result;
        }
    })
}

function createCm(idPost) {
    let idAcc = window.sessionStorage.getItem('ID_KEY');
    let contentNew = document.getElementById('comment' + idPost).value;
    if (contentNew == "") {
        return;
    }
    let comment = {content: contentNew};
    $.ajax({
        url: 'https://vilo-vn.herokuapp.com/user/comment/' + idAcc + '/' + idPost,
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': window.sessionStorage.getItem('TOKEN_KEY')
        },
        data: JSON.stringify(comment),
        success: function () {
            showRePost(idPost);
        },
        error: function () {
            showRePost(idPost);
        }
    })
}
let list = [];
function themvaogiohang(idProdc){
    let produc = {id:idProdc};
    list.push(produc);
    localStorage.setItem("lístt",JSON.stringify(list));
}

function post() {
    let idPost = $('#idPost').val();
    let content = $('#content').val();
    if (content == "") {
        return;
    }
    let privacy = $('#privacy').val();
    let timePost = new Date();
    let img = $('#image').val();
    let account = {id: window.sessionStorage.getItem('ID_KEY')}
    let post = {conten: content, privacy: privacy, timePost: timePost, account: account}
    let image = {path: img, post: post}

    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': window.sessionStorage.getItem('TOKEN_KEY')
        },
        type: "POST",
        data: JSON.stringify(image),
        //tên API
        url: "https://vilo-vn.herokuapp.com/user/createPost",
        //xử lý khi thành công
        success: function (data) {
            document.getElementById("uploadfile").value = "";
            document.getElementById("content").value = "";
            document.getElementById("privacy").value = "";
            document.getElementById("image").value = "";
            window.location.reload();
        }

    })
    event.preventDefault();
}
