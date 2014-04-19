NAME=craigslistinlineimage
FILES=manifest.json $(NAME).js options.html options.js \
	icon16.png icon48.png icon128.png

PATHS=$(foreach file, $(FILES),$(NAME)/$(file))

all:
	cd .. && zip $(NAME).zip $(PATHS) && cd $(NAME)

clean:
	rm -rf *~ ../$(NAME).zip

distclean:
	rm -rf ../$(NAME).crx ../$(NAME).pem

allclean: clean distclean
