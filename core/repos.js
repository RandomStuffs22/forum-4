var Node = require("tree-node"),
    crypto = require("crypto"),
    shortid = require("shortid"),
    Result = require("result-brighthas");

module.exports = wrap;

function wrap(my) {

    var topicRepo = new my.Repository("Topic");

    topicRepo._create = function (args, callback) {
        args.id = shortid.generate();
        var Topic = my.Aggres.Topic;
        var topic = new Topic(args);
        if (topic.hasError()) {
            callback(topic.result);
        } else {
            callback(null, topic);
        }
    }

    topicRepo._data2aggre = function (data) {
        var Topic = my.Aggres.Topic;
        return Topic.reborn(data);
    }

    topicRepo._aggre2data = function (aggre) {
        return aggre.toJSON();
    }


    var replyRepo = new my.Repository("Reply");

    replyRepo._create = function (args, callback) {
        var selfUser, parentUser;
        my.repos.Topic.get(args.topicId)
            .then(function (p) {
                return my.repos.User.get(p ? p.authorId : "");
            }).then(function (u) {
                parentUser = u;
                return my.repos.User.get(args.authorId);
            }).then(function (su) {

                selfUser = su;

                if (selfUser && parentUser) {
                    args.title = selfUser.nickname + " 回复：" + parentUser.nickname;
                }

                args.id = shortid.generate();
                var Reply = my.Aggres.Reply;
                var reply = new Reply(args);

                if (reply.hasError()) {
                    callback(reply.result);
                } else {
                    callback(null, reply);
                }

            })
    }

    replyRepo._data2aggre = function (data) {

        var Reply = my.Aggres.Reply;
        return Reply.reborn(data);
    }

    replyRepo._aggre2data = function (aggre) {
        return aggre.toJSON();
    }


    var columnRepo = new my.Repository("Column");

    columnRepo._create = function (args, callback) {
        args.id = shortid.generate();
        var Column = my.Aggres.Column;
        var column = new Column(args);
        if (column.hasError()) {
            callback(column.result);
        } else {
            callback(null, column)
        }
    }

    columnRepo._aggre2data = function (aggre) {
        return aggre.toJSON();
    }

    columnRepo._data2aggre = function (data) {
        var Column = my.Aggres.Column;
        return Column.reborn(data);
    }

    var userRepo = new my.Repository("User");

    userRepo._create = function (args, callback) {
        args.id = shortid.generate();

        my.services.userUnique(args.email, args.nickname, function (unique) {
            if (unique) {
                var result = new Result();
                unique.forEach(function (k) {
                    if (k === "nickname") {
                        result.error("nickname", "昵称已被使用");
                    }
                    if (k === "email") {
                        result.error("email", "邮箱已被使用")
                    }
                });
                callback(result);
            } else {
                var user = new my.Aggres.User(args);
                if (user.hasError()) {
                    callback(user.result);
                } else {
                    callback(null, user);
                }
            }
        });
    }

    userRepo._aggre2data = function (aggre) {
        return aggre.toJSON();
    }

    userRepo._data2aggre = function (data) {
        return my.Aggres.User.reborn(data);
    }

    var messageRepo = new my.Repository("Message");


    messageRepo._create = function (args, callback) {
        args.id = shortid.generate();

        var msg = new my.Aggres.Message(args);
        if (msg.hasError()) {
            callback(msg.result);
        } else {
            callback(null, msg);
        }
    }

    messageRepo._data2aggre = function (data) {
        return my.Aggres.Message.reborn(data);
    }

    messageRepo._aggre2data = function (aggre) {
        return aggre.toJSON();
    }

    var infoRepo = new my.Repository("Info");

    infoRepo._create = function (args, callback) {
        args.id = shortid.generate();

        var info = new my.Aggres.Info(args);
        if (info.hasError()) {
            callback(info.result);
        } else {
            callback(null, info);
        }
    }

    infoRepo._data2aggre = function (data) {
        return my.Aggres.Info.reborn(data);
    }

    infoRepo._aggre2data = function (aggre) {
        return aggre.toJSON();
    }

    var userRepo = new my.Repository("User");

    userRepo._create = function (args, callback) {
        args.id = shortid.generate();

        my.services.userUnique(args.email, args.nickname, function (unique) {
            if (unique) {
                var result = new Result();
                unique.forEach(function (k) {
                    if (k === "nickname") {
                        result.error("nickname", "昵称已被使用");
                    }
                    if (k === "email") {
                        result.error("email", "邮箱已被使用")
                    }
                });
                callback(result);
            } else {
                var user = new my.Aggres.User(args);
                if (user.hasError()) {
                    callback(user.result);
                } else {
                    callback(null, user);
                }
            }
        });
    }

    userRepo._aggre2data = function (aggre) {
        return aggre.toJSON();
    }

    userRepo._data2aggre = function (data) {
        return my.Aggres.User.reborn(data);
    }

    return [replyRepo, columnRepo, topicRepo, userRepo, messageRepo, infoRepo];
}
