module.exports = {
    printWidth: 120,
    tabWidth: 4,
    useTabs: false,
    bracketSpacing: true,
    semi: true,
    singleQuote: false,
    endOfLine: "lf",
    trailingComma: "es5",
    quoteProps: "as-needed",
    overrides: [
        {
            excludeFiles: ["*.min.js", "*.min.css", "*.min.html", "*.min.scss"],
            files: ["*.js", "*.css", "*.sass", "*.html", "*.md", "*.ts"],
            options: {
                semi: true,
            },
        },
    ],
};
