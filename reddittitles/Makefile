NAME=reddittitles
FILES=manifest.json reddittitles.js *.png

PATHS=$(foreach file, $(FILES),$(NAME)/$(file))

all:
	cd .. && zip $(NAME).zip $(PATHS) && cd $(NAME)

clean:
	rm -rf *~ ../$(NAME).zip
