import Text from '@/components/Text';

const BackupPhrase = () => {
  return (
    <>
      <Text className="mt-60" size="h4" fontWeight="medium">
        Secret backup phrase
      </Text>
      <Text color="text-secondary" size="h5" align="center" className="mt-24">
        Your secret backup phrase makes it easy to back up and restore your account.
      </Text>
    </>
  );
};

export default BackupPhrase;
