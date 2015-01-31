NAME=parodify
FILES=manifest.json content.js parodify.js background.js icon16.png icon48.png icon128.png

PATHS=$(foreach file, $(FILES),$(NAME)/$(file))

all:
	cd .. && zip $(NAME).zip $(PATHS) && cd $(NAME)

clean:
	rm -rf *~ ../$(NAME).zip
