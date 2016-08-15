module.exports = {
    saveArticle: function(controller, article) {
        console.log("Persisting article: " + article.name);
        controller.storage.teams.save({
            id: article.name,
            article: article
        }, function(err) {
            if (err != null) {
                console.log("Error persisting article: " + article.name);
                console.log(err);
            }
        });
    }
};
