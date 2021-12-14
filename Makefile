all: deploy open

SFTP_PATH      = "cubing.net:~/cubing.net/inspection/"
URL2            = "http://cubing.net/inspection"

SFTP_PATH      = "cubing.net:~/inspection.cubing.net/"
URL2            = "http://inspection.cubing.net/"

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
	rsync -avz \
		--exclude .DS_Store \
		--exclude .git \
		--exclude .gitignore \
		--exclude .gitmodules \
		./ \
		${SFTP_PATH_2}
	echo "\nDone deploying. Go to ${URL2}\n"

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
