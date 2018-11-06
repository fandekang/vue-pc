export const form = {
    methods: {
        submitForm(refName, callback) {
            this.$refs[refName].validate(result => {
                if(result) {
                    callback.call(this);
                }
                else {
                    return false;
                }
            });
        },
        resetForm(refName) {
            this.$refs[refName].resetFields();
        },
        photoValidator(file, callback) {
            let isJPG = file.type === 'image/jpeg' || file.type === 'image/png',
                isBt3k = file.size / 1024 > 3,
                isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            if (!isBt3k) {
                this.$message.error('上传头像图片大小不能小于 3KB!');
            }

            if (isJPG && isLt2M && isBt3k) {
                callback.call(this);
            }
        }
    }
}
