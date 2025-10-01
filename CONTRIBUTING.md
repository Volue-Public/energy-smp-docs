# Development environment

Required packages & recommended versions:
- Python (3.11)
- [MkDocs](https://www.mkdocs.org/) (1.6.1)
- [mike](https://github.com/jimporter/mike/tree/master) (2.1.3) for documentation versioning
- [python-markdown-math](https://pypi.org/project/python-markdown-math/) (0.8) for displaying math expressions
- Node.js (22) and npm (10.9.0) for package management

# Getting the Volue Wave Core package

Since we want to align the look of the documentation website with the company styling,
we use the [Wave Core package](https://volue.github.io/wave/). It is hosted in a private registry and requires an access token to fetch. To obtain the access token, contact the Volue Wave team or the Mesh team.
Once you have the token, create an environment variable called `NPM_TOKEN` and set its value to the access token.

Use the command `npm config list` to check if `.npmrc` file already exists for you. If not, create a local `.npmrc` in the repository.

Place this into the `.npmrc`:
```
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
```

Do not replace `${NPM_TOKEN}` with a real token. The `npm` CLI will do that for you.

# Workflow

Once your environment is ready, try to build the documentation:
```
.\build_documentation.ps1
```

The script should install the Wave Core package, move the required assets to the `docs` folder and build the documentation.
Output files should be created in the `site` directory.

**IMPORTANT: Make sure to run this step when setting up or changing the Wave Core version. The documentation might not display correctly if you miss it.**

## Development server

In daily documentation development, it is convenient to use this command:
```
python -m mkdocs serve
```

It starts a development server which automatically reloads when the files in `docs` directory are modified. Then, you can see the current version of the documentation with local changes in your browser.

# Versioning

It is possible to browse the documentation associated with a given SmP release.
The user can display it, by using the version selector dropdown placed just below the company logo.

To create a new version of the documentation, use the `mike deploy X.Y` command, where `X.Y` is the version number.
This command:
- builds the documentation
- creates the `X.Y` directory on the destination branch (`gh-pages` by default) and puts the docs inside
- creates a commit

If the new version is also the latest one, add an alias `latest`:
```
mike deploy X.Y latest
```

If the `latest` alias was already used for some older version you need also to provide `--update-aliases`:
```
mike deploy X.Y latest --update-aliases
```

Once deployed, you can browse through all the documentation versions using `mike serve` command.

Pass the `--push` flag to the `deploy` command to push your changes to the remote and publish the documentation.
