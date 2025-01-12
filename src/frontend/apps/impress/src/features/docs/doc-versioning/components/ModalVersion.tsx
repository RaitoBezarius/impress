import {
  Alert,
  Button,
  Modal,
  ModalSize,
  VariantType,
  useToastProvider,
} from '@openfun/cunningham-react';
import { t } from 'i18next';
import { useRouter } from 'next/navigation';
import * as Y from 'yjs';

import { Box, Text } from '@/components';
import { toBase64, useDocStore } from '@/features/docs/doc-editor';
import { Doc, useUpdateDoc } from '@/features/docs/doc-management';

import { KEY_LIST_DOC_VERSIONS } from '../api/useDocVersions';
import { Versions } from '../types';
import { revertUpdate } from '../utils';

interface ModalVersionProps {
  onClose: () => void;
  docId: Doc['id'];

  versionId: Versions['version_id'];
}

export const ModalVersion = ({
  onClose,
  docId,
  versionId,
}: ModalVersionProps) => {
  const { toast } = useToastProvider();
  const router = useRouter();
  const { docsStore, setStore } = useDocStore();
  const { mutate: updateDoc } = useUpdateDoc({
    listInvalideQueries: [KEY_LIST_DOC_VERSIONS],
    onSuccess: () => {
      const onDisplaySuccess = () => {
        toast(t('Version restored successfully'), VariantType.SUCCESS);
        router.push(`/docs/${docId}`);
      };

      if (!docsStore?.[docId]?.provider || !docsStore?.[versionId]?.provider) {
        onDisplaySuccess();
        return;
      }

      setStore(docId, {
        editor: undefined,
      });

      revertUpdate(
        docsStore[docId].provider.document,
        docsStore[docId].provider.document,
        docsStore[versionId].provider.document,
      );

      onDisplaySuccess();
    },
  });

  return (
    <Modal
      isOpen
      closeOnClickOutside
      hideCloseButton
      leftActions={
        <Button
          aria-label={t('Close the modal')}
          color="secondary"
          fullWidth
          onClick={() => onClose()}
        >
          {t('Cancel')}
        </Button>
      }
      onClose={() => onClose()}
      rightActions={
        <Button
          aria-label={t('Restore')}
          color="primary"
          fullWidth
          onClick={() => {
            const newDoc = toBase64(
              Y.encodeStateAsUpdate(docsStore?.[versionId]?.provider.document),
            );

            updateDoc({
              id: docId,
              content: newDoc,
            });
          }}
        >
          {t('Restore')}
        </Button>
      }
      size={ModalSize.MEDIUM}
      title={
        <Box $gap="1rem">
          <Text $isMaterialIcon $size="36px" $theme="primary">
            restore
          </Text>
          <Text as="h2" $size="h3" $margin="none">
            {t('Restore this version?')}
          </Text>
        </Box>
      }
    >
      <Box aria-label={t('Modal confirmation to restore the version')}>
        <Alert canClose={false} type={VariantType.WARNING}>
          <Box>
            <Text>
              {t('Your current document will revert to this version.')}
            </Text>
            <Text>{t('If a member is editing, his works can be lost.')}</Text>
          </Box>
        </Alert>
      </Box>
    </Modal>
  );
};
