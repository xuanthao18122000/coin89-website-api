# E CARD SUBMODULE

## Submodule

```bash
# Submodule add repo gitlab
$ git submodule add ssh://git@lubrytics.com:9289/estuary/e-card/backend/e-card-submodule.git src/submodules

# Delete submodule and Run script remove submodule
$ rm -rf .git/modules/src/submodules

# Update new code branch submodule
$ git submodule update --remote

# When clone project run script
$ git submodule update --init
```
## .gitsubmodile

```bash
# Create file .gitsubmodile and add script to file
[submodule "src/submodules"]
	path = src/submodules
	url = ../../backend/e-card-submodule.git
	branch = dev

```
