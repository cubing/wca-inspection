all: deploy open

SFTP_PATH      = "cubing.net:~/cubing.net/inspection/"
URL            = "http://cubing.net/inspection"

SFTP_TEST_PATH = "cubing.net:~/cubing.net/inspection-test/"
TEST_URL       = "http://cubing.net/inspection-test/"


.PHONY: deploy
deploy:
	rsync -avz \
		--exclude .DS_Store \
		--exclude .git \
		--exclude .gitignore \
		--exclude .gitmodules \
		./ \
		${SFTP_PATH}
	echo "\nDone deploying. Go to ${URL}\n"

.PHONY: deploy-test
deploy-test:
	rsync -avz \
		--exclude .DS_Store \
		--exclude .git \
		--exclude .gitignore \
		--exclude .gitmodules \
		./ \
		${SFTP_TEST_PATH}
	echo "\nDone deploying. Go to ${TEST_URL}\n"


.PHONY: open
open:
	open ${URL}
