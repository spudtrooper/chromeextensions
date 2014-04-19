NAME=redditcolor
FILES=manifest.json redditcolor.js

PATHS=$(foreach file, $(FILES),$(NAME)/$(file))

all:
	cd .. && zip $(NAME).zip $(PATHS) && cd $(NAME)

clean:
	rm -rf *~ ../$(NAME).zip
